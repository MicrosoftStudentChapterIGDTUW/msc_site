import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { GDEvaluation } from "@/models/GDEvaluation";
import { logAdminActivity } from "@/lib/gdAdminActivity";
import { getSessionWindowState } from "@/lib/gdSessionWindow";

/**
 * POST /api/gd/[groupId]/submit
 * Submit evaluations for peers
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    await connectToDatabase();
    
    const body = await request.json();
    const { evaluatorId, evaluations } = body;

    if (!evaluatorId || !evaluations || !Array.isArray(evaluations)) {
      return NextResponse.json(
        { success: false, error: "Missing groupId, evaluatorId, or evaluations array." },
        { status: 400 }
      );
    }

    if (evaluations.length === 0) {
      return NextResponse.json(
        { success: false, error: "Evaluations array cannot be empty." },
        { status: 400 }
      );
    }

    const group = await GDGroup.findOne({ groupId });
    if (!group) {
      return NextResponse.json(
        { success: false, error: "GD Group not found." },
        { status: 404 }
      );
    }

    if (group.status === "closed") {
      return NextResponse.json(
        { success: false, error: "This GD Group is closed." },
        { status: 403 }
      );
    }

    const windowState = getSessionWindowState(group);
    if (!windowState.isActive) {
      if (windowState.code === "expired") {
        await GDGroup.updateOne({ groupId }, { $set: { status: "closed" } });
      }
      return NextResponse.json(
        { success: false, status: windowState.code, error: windowState.message },
        { status: 403 }
      );
    }

    const additionalFromArray = group.additionalEvaluators || [];
    const additionalEvaluatorIds = new Set<string>([
      ...(group.additionalEvaluatorIds || []).map((id) => String(id)),
      ...additionalFromArray.map((participant) => String(participant.id)),
    ]);
    const additionalFromParticipants = group.participants.filter(
      (participant) =>
        participant.isAdditionalEvaluator || additionalEvaluatorIds.has(String(participant.id))
    );
    const coreParticipants = group.participants.filter(
      (participant) =>
        !participant.isAdditionalEvaluator && !additionalEvaluatorIds.has(String(participant.id))
    );
    const mergedAdditional = additionalFromArray.length > 0 ? additionalFromArray : additionalFromParticipants;
    const allMembers = [...coreParticipants, ...mergedAdditional];

    const evaluator = allMembers.find((participant) => participant.id === evaluatorId);
    if (!evaluator) {
      return NextResponse.json(
        { success: false, error: "Evaluator not found in this group." },
        { status: 404 }
      );
    }

    const isAdditionalEvaluator =
      evaluator.isAdditionalEvaluator || additionalEvaluatorIds.has(String(evaluator.id));
    const allowedEvaluateeIds = new Set(
      (isAdditionalEvaluator
        ? coreParticipants
        : coreParticipants.filter((p) => p.id !== evaluatorId)
      ).map((p) => p.id)
    );

    if (evaluator.hasSubmitted) {
      return NextResponse.json(
        { success: false, error: "You have already submitted your evaluation for this session." },
        { status: 409 }
      );
    }

    const evaluationsToInsert = [];
    const expectedEvaluateeCount = allowedEvaluateeIds.size;
    
    for (const evalData of evaluations) {
      // Handle mapping from frontend field names if they differ
      // Frontend uses: peerId, ratings, contribution, teamPlayer, strength, improvement
      const evaluateeId = evalData.peerId || evalData.evaluateeId;
      const contributionType = evalData.contribution || evalData.contributionType;
      const isTeamPlayer = evalData.teamPlayer !== undefined ? evalData.teamPlayer : evalData.isTeamPlayer;

      if (!evaluateeId || !allowedEvaluateeIds.has(evaluateeId)) continue;

      const ratings = Array.isArray(evalData.ratings) ? evalData.ratings : [];
      const hasCompleteRatings =
        ratings.length === 7 && ratings.every((value: unknown) => Number(value) >= 1 && Number(value) <= 5);
      const hasRequiredFeedback =
        typeof contributionType === "string" &&
        contributionType.trim().length > 0 &&
        typeof isTeamPlayer === "boolean" &&
        typeof evalData.strength === "string" &&
        evalData.strength.trim().length > 0 &&
        typeof evalData.improvement === "string" &&
        evalData.improvement.trim().length > 0;

      if (!hasCompleteRatings || !hasRequiredFeedback) continue;

      evaluationsToInsert.push({
        groupId,
        evaluatorId,
        evaluateeId,
        ratings,
        contributionType,
        isTeamPlayer,
        strength: evalData.strength,
        improvement: evalData.improvement,
      });
    }

    if (
      evaluationsToInsert.length === 0 ||
      new Set(evaluationsToInsert.map((item) => item.evaluateeId)).size !== expectedEvaluateeCount ||
      evaluationsToInsert.length !== expectedEvaluateeCount
    ) {
       return NextResponse.json(
        { success: false, error: "Please complete all peer evaluations before submitting." },
        { status: 400 }
      );
    }

    await GDEvaluation.insertMany(evaluationsToInsert);

    const participantSubmitUpdate = await GDGroup.updateOne(
      { groupId, "participants.id": evaluatorId },
      { $set: { "participants.$.hasSubmitted": true } }
    );
    if (participantSubmitUpdate.modifiedCount === 0) {
      await GDGroup.updateOne(
        { groupId, "additionalEvaluators.id": evaluatorId },
        { $set: { "additionalEvaluators.$.hasSubmitted": true } }
      );
    }

    if (group.createdByAdminId && group.createdByAdminEmail) {
      await logAdminActivity({
        adminId: group.createdByAdminId,
        adminEmail: group.createdByAdminEmail,
        action: "PARTICIPANT_SUBMIT",
        groupId,
        details: `${evaluator.name} submitted evaluations`,
      });
    }

    // Check if everyone has submitted
    const updatedGroup = await GDGroup.findOne({ groupId });
    const updatedAdditionalFromArray = updatedGroup?.additionalEvaluators || [];
    const updatedAdditionalIds = new Set<string>([
      ...((updatedGroup?.additionalEvaluatorIds || []) as string[]).map((id) => String(id)),
      ...updatedAdditionalFromArray.map((participant) => String(participant.id)),
    ]);
    const updatedCoreParticipants = (updatedGroup?.participants || []).filter(
      (participant) =>
        !participant.isAdditionalEvaluator && !updatedAdditionalIds.has(String(participant.id))
    );
    const allSubmitted = updatedCoreParticipants.every((participant) => participant.hasSubmitted === true);
    
    if (allSubmitted) {
      await GDGroup.updateOne({ groupId }, { $set: { status: "closed" } });

      if (group.createdByAdminId && group.createdByAdminEmail) {
        await logAdminActivity({
          adminId: group.createdByAdminId,
          adminEmail: group.createdByAdminEmail,
          action: "AUTO_CLOSE_GROUP",
          groupId,
          details: "All participants submitted. Session auto-closed.",
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Evaluations submitted successfully.",
        allStatuses: [
          ...(updatedGroup?.participants || []),
          ...(updatedGroup?.additionalEvaluators || []),
        ].map((participant) => ({
          name: participant.name,
          submitted: participant.hasSubmitted,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "You have already submitted your evaluation for this session." },
        { status: 409 }
      );
    }
    console.error(`Error submitting evaluations:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

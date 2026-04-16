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

    const evaluator = group.participants.find((p) => p.id === evaluatorId);
    if (!evaluator) {
      return NextResponse.json(
        { success: false, error: "Evaluator not found in this group." },
        { status: 404 }
      );
    }

    if (evaluator.hasSubmitted) {
      return NextResponse.json(
        { success: false, error: "You have already submitted your evaluation for this session." },
        { status: 409 }
      );
    }

    const evaluationsToInsert = [];
    const participantIds = new Set(group.participants.map((p) => p.id));
    const expectedEvaluateeCount = Math.max(group.participants.length - 1, 0);
    
    for (const evalData of evaluations) {
      // Handle mapping from frontend field names if they differ
      // Frontend uses: peerId, ratings, contribution, teamPlayer, strength, improvement
      const evaluateeId = evalData.peerId || evalData.evaluateeId;
      const contributionType = evalData.contribution || evalData.contributionType;
      const isTeamPlayer = evalData.teamPlayer !== undefined ? evalData.teamPlayer : evalData.isTeamPlayer;

      if (!evaluateeId || !participantIds.has(evaluateeId)) continue;
      if (evaluateeId === evaluatorId) continue;

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

    await GDGroup.updateOne(
      { groupId, "participants.id": evaluatorId },
      { $set: { "participants.$.hasSubmitted": true } }
    );

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
    const allSubmitted = updatedGroup?.participants.every((p) => p.hasSubmitted === true);
    
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
        allStatuses: updatedGroup?.participants.map(p => ({
            name: p.name,
            submitted: p.hasSubmitted
        }))
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

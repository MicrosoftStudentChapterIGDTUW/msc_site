import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { GDEvaluation } from "@/models/GDEvaluation";

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

    const evaluator = group.participants.find((p) => p.id === evaluatorId);
    if (!evaluator) {
      return NextResponse.json(
        { success: false, error: "Evaluator not found in this group." },
        { status: 404 }
      );
    }

    if (evaluator.hasSubmitted) {
      return NextResponse.json(
        { success: false, error: "You have already submitted." },
        { status: 400 }
      );
    }

    const evaluationsToInsert = [];
    const participantIds = new Set(group.participants.map((p) => p.id));
    
    for (const evalData of evaluations) {
      // Handle mapping from frontend field names if they differ
      // Frontend uses: peerId, ratings, contribution, teamPlayer, strength, improvement
      const evaluateeId = evalData.peerId || evalData.evaluateeId;
      const contributionType = evalData.contribution || evalData.contributionType;
      const isTeamPlayer = evalData.teamPlayer !== undefined ? evalData.teamPlayer : evalData.isTeamPlayer;

      if (!evaluateeId || !participantIds.has(evaluateeId)) continue;
      if (evaluateeId === evaluatorId) continue;

      evaluationsToInsert.push({
        groupId,
        evaluatorId,
        evaluateeId,
        ratings: evalData.ratings,
        contributionType,
        isTeamPlayer,
        strength: evalData.strength,
        improvement: evalData.improvement,
      });
    }

    if (evaluationsToInsert.length === 0) {
       return NextResponse.json(
        { success: false, error: "No valid evaluations to submit." },
        { status: 400 }
      );
    }

    await GDEvaluation.insertMany(evaluationsToInsert);

    // Update submission status
    await GDGroup.updateOne(
      { groupId, "participants.id": evaluatorId },
      { $set: { "participants.$.hasSubmitted": true } }
    );

    // Check if everyone has submitted
    const updatedGroup = await GDGroup.findOne({ groupId });
    const allSubmitted = updatedGroup?.participants.every((p) => p.hasSubmitted === true);
    
    if (allSubmitted) {
      await GDGroup.updateOne({ groupId }, { $set: { status: "closed" } });
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
    console.error(`Error submitting evaluations:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

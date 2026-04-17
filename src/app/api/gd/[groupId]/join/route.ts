import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { getSessionWindowState } from "@/lib/gdSessionWindow";

/**
 * POST /api/gd/[groupId]/join
 * Mark a participant as joined and fetch session data
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const { participantName } = await request.json();
    
    if (!participantName) {
      return NextResponse.json(
        { success: false, error: "Missing participantName." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const group = await GDGroup.findOne({ groupId });

    if (!group) {
      return NextResponse.json(
        { success: false, error: "GD Group not found." },
        { status: 404 }
      );
    }

    if (group.status === "closed") {
      return NextResponse.json(
        { success: false, error: "This GD Session is already closed." },
        { status: 403 }
      );
    }

    const windowState = getSessionWindowState(group);
    if (!windowState.isActive) {
      if (windowState.code === "expired") {
        group.status = "closed";
        await group.save();
      }
      return NextResponse.json(
        { success: false, status: windowState.code, error: windowState.message },
        { status: 403 }
      );
    }

    const normalizedName = participantName.trim().toLowerCase();
    const additionalFromArray = group.additionalEvaluators || [];
    const additionalEvaluatorIds = new Set<string>([
      ...(group.additionalEvaluatorIds || []).map((id) => String(id)),
      ...additionalFromArray.map((participant) => String(participant.id)),
    ]);

    const participantIndex = group.participants.findIndex(
      (p) => p.name.toLowerCase() === normalizedName
    );
    const additionalIndex = additionalFromArray.findIndex(
      (p) => p.name.toLowerCase() === normalizedName
    );

    if (participantIndex === -1 && additionalIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Participant not found in this group." },
        { status: 404 }
      );
    }

    const evaluator =
      participantIndex !== -1
        ? group.participants[participantIndex]
        : additionalFromArray[additionalIndex];

    if (evaluator.hasSubmitted) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already submitted your evaluation for this session.",
        },
        { status: 409 }
      );
    }

    // Update isJoined status
    if (participantIndex !== -1) {
      group.participants[participantIndex].isJoined = true;
    } else if (additionalIndex !== -1) {
      group.additionalEvaluators[additionalIndex].isJoined = true;
    }
    await group.save();

    const additionalFromParticipants = group.participants.filter(
      (participant) =>
        participant.isAdditionalEvaluator || additionalEvaluatorIds.has(String(participant.id))
    );
    const coreParticipants = group.participants.filter(
      (participant) =>
        !participant.isAdditionalEvaluator && !additionalEvaluatorIds.has(String(participant.id))
    );
    const mergedAdditional = additionalFromArray.length > 0 ? additionalFromArray : additionalFromParticipants;
    const isAdditionalEvaluator =
      evaluator.isAdditionalEvaluator || additionalEvaluatorIds.has(String(evaluator.id));
    const peerPool = isAdditionalEvaluator
      ? coreParticipants
      : coreParticipants.filter((p) => p.id !== evaluator.id);

    return NextResponse.json(
      {
        success: true,
        groupId: group.groupId,
        topic: group.topic,
        date: group.date,
        time: group.time,
        duration: group.duration,
        scheduleStartAt: group.scheduleStartAt,
        scheduleEndAt: group.scheduleEndAt,
        status: group.status,
        participants: coreParticipants,
        additionalEvaluators: mergedAdditional,
        additionalEvaluatorIds: [...additionalEvaluatorIds],
        // Frontend expects 'peers' so it can evaluate everyone EXCEPT itself
        peers: peerPool
          .map(p => ({
            id: p.id,
            name: p.name,
            initials: p.name.split(" ").map(n => n[0]).join("").slice(0, 2)
          })),
        evaluatorId: evaluator.id
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error joining GD group:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

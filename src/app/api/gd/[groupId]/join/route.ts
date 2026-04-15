import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";

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

    // Find the participant by name (case-insensitive)
    const participantIndex = group.participants.findIndex(
      (p) => p.name.toLowerCase() === participantName.trim().toLowerCase()
    );

    if (participantIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Participant not found in this group." },
        { status: 404 }
      );
    }

    // Update isJoined status
    group.participants[participantIndex].isJoined = true;
    await group.save();

    const evaluator = group.participants[participantIndex];

    return NextResponse.json(
      {
        success: true,
        groupId: group.groupId,
        topic: group.topic,
        status: group.status,
        participants: group.participants,
        // Frontend expects 'peers' so it can evaluate everyone EXCEPT itself
        peers: group.participants
          .filter(p => p.id !== evaluator.id)
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

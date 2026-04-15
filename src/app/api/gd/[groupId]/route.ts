import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { GDEvaluation } from "@/models/GDEvaluation";
import { getSessionWindowState } from "@/lib/gdSessionWindow";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";
import { logAdminActivity } from "@/lib/gdAdminActivity";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/gd/[groupId]
 * Fetch the details of a specific GD group
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    await connectToDatabase();

    const group = await GDGroup.findOne({ groupId }).lean();

    if (!group) {
      return NextResponse.json(
        { success: false, error: "GD Group not found." },
        { status: 404 }
      );
    }

    // Usually, we want to tell the frontend if the group is closed so it can show a "Closed" screen
    if (group.status === "closed") {
      return NextResponse.json(
        { 
          success: false, 
          status: "closed",
          error: "This GD Group is no longer accepting submissions." 
        },
        { status: 403 }
      );
    }

    const windowState = getSessionWindowState(group);
    if (!windowState.isActive) {
      if (windowState.code === "expired") {
        await GDGroup.updateOne({ groupId }, { $set: { status: "closed" } });
      }

      const admin = await getAuthenticatedAdmin();
      if (admin && group.createdByAdminId === admin.id) {
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
            windowState: windowState.code,
            participants: group.participants,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          status: windowState.code,
          error: windowState.message,
        },
        { status: 403 }
      );
    }

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
        participants: group.participants,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching GD Group:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/gd/[groupId]
 * Update a current GD session (Admin only, owner only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    await connectToDatabase();

    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    const group = await GDGroup.findOne({ groupId });
    if (!group) {
      return NextResponse.json(
        { success: false, error: "GD Group not found." },
        { status: 404 }
      );
    }

    if (group.createdByAdminId !== admin.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden. This session belongs to another admin." },
        { status: 403 }
      );
    }

    if (group.status === "closed") {
      return NextResponse.json(
        { success: false, error: "Closed sessions cannot be modified." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updates: {
      topic?: string;
      date?: string;
      time?: string;
      duration?: string;
      scheduleStartAt?: Date;
      scheduleEndAt?: Date;
      participants?: Array<{
        id: string;
        name: string;
        hasSubmitted: boolean;
        isJoined?: boolean;
      }>;
    } = {};

    let removedParticipantIds: string[] = [];

    if (typeof body.topic === "string") {
      const topic = body.topic.trim();
      if (!topic) {
        return NextResponse.json(
          { success: false, error: "Topic cannot be empty." },
          { status: 400 }
        );
      }
      updates.topic = topic;
    }

    if (typeof body.date === "string") updates.date = body.date;
    if (typeof body.time === "string") updates.time = body.time;
    if (typeof body.duration === "string") {
      const minutes = Number(body.duration);
      if (!Number.isFinite(minutes) || minutes <= 0) {
        return NextResponse.json(
          { success: false, error: "Duration must be a positive number." },
          { status: 400 }
        );
      }
      updates.duration = body.duration;
    }

    if (typeof body.scheduleStartAt === "string") {
      const parsed = new Date(body.scheduleStartAt);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid schedule start time." },
          { status: 400 }
        );
      }
      updates.scheduleStartAt = parsed;
    }

    if (typeof body.scheduleEndAt === "string") {
      const parsed = new Date(body.scheduleEndAt);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid schedule end time." },
          { status: 400 }
        );
      }
      updates.scheduleEndAt = parsed;
    }

    if (Array.isArray(body.participants)) {
      type GroupParticipant = {
        id: string;
        name: string;
        hasSubmitted: boolean;
        isJoined?: boolean;
      };

      if (body.participants.length < 2) {
        return NextResponse.json(
          { success: false, error: "At least 2 participants are required." },
          { status: 400 }
        );
      }

      const trimmedNames = body.participants
        .map((name: unknown) => (typeof name === "string" ? name.trim() : ""))
        .filter((name: string) => name.length > 0);

      if (trimmedNames.length !== body.participants.length) {
        return NextResponse.json(
          { success: false, error: "Participant names cannot be empty." },
          { status: 400 }
        );
      }

      const lowerNames = trimmedNames.map((name: string) => name.toLowerCase());
      const uniqueNames = new Set(lowerNames);
      if (uniqueNames.size !== lowerNames.length) {
        return NextResponse.json(
          { success: false, error: "Duplicate participant names are not allowed." },
          { status: 400 }
        );
      }

      const existingByLower = new Map<string, GroupParticipant>(
        (group.participants as GroupParticipant[]).map((participant: GroupParticipant) => [
          participant.name.toLowerCase(),
          participant,
        ])
      );

      const nextParticipants = trimmedNames.map((name: string) => {
        const existing = existingByLower.get(name.toLowerCase());
        if (existing) {
          return {
            id: existing.id,
            name,
            hasSubmitted: existing.hasSubmitted,
            isJoined: existing.isJoined,
          };
        }

        return {
          id: uuidv4(),
          name,
          hasSubmitted: false,
          isJoined: false,
        };
      });

      const nextIds = new Set(nextParticipants.map((participant: GroupParticipant) => participant.id));
      removedParticipantIds = (group.participants as GroupParticipant[])
        .filter((participant: GroupParticipant) => !nextIds.has(participant.id))
        .map((participant: GroupParticipant) => participant.id);

      updates.participants = nextParticipants;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update." },
        { status: 400 }
      );
    }

    await GDGroup.updateOne({ groupId }, { $set: updates });

    if (removedParticipantIds.length > 0) {
      await GDEvaluation.deleteMany({
        groupId,
        $or: [
          { evaluatorId: { $in: removedParticipantIds } },
          { evaluateeId: { $in: removedParticipantIds } },
        ],
      });
    }

    const updatedGroup = await GDGroup.findOne({ groupId }).lean();

    try {
      await logAdminActivity({
        adminId: admin.id,
        adminEmail: admin.email,
        action: "UPDATE_GROUP",
        groupId,
        details: `Updated session fields: ${Object.keys(updates).join(", ")}`,
      });
    } catch (activityError) {
      console.error("Activity log failed during update:", activityError);
    }

    return NextResponse.json({ success: true, data: updatedGroup });
  } catch (error) {
    console.error("Error updating GD Group:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";

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

    return NextResponse.json(
      {
        success: true,
        groupId: group.groupId,
        topic: group.topic,
        date: group.date,
        time: group.time,
        duration: group.duration,
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

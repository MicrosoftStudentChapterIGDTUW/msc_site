import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";

/**
 * POST /api/gd/[groupId]/force-close
 * Manually close a GD Session (Admin Only)
 */
export async function POST(
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

    if (group.status === "closed") {
      return NextResponse.json(
        { success: false, error: "This GD Group is already closed." },
        { status: 400 }
      );
    }

    await GDGroup.updateOne(
      { groupId },
      { $set: { status: "closed" } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "GD Group forcefully closed.",
        groupId: group.groupId,
        status: "closed",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error forcefully closing GD group:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

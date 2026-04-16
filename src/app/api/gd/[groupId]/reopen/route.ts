import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";
import { logAdminActivity } from "@/lib/gdAdminActivity";

/**
 * POST /api/gd/[groupId]/reopen
 * Reopen a closed GD Session (Admin Only, owner only)
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const body = await request.json().catch(() => ({}));
    const durationMinutes = Number(body?.durationMinutes);

    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid reopen duration in minutes." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    const group = await GDGroup.findOne({ groupId }).lean();
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

    if (group.status !== "closed") {
      return NextResponse.json(
        { success: false, error: "Only closed sessions can be reopened." },
        { status: 400 }
      );
    }

    const startAt = new Date();
    const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);
    const date = startAt.toISOString().slice(0, 10);
    const time = startAt.toTimeString().slice(0, 5);

    await GDGroup.updateOne(
      { groupId },
      {
        $set: {
          status: "open",
          date,
          time,
          duration: String(durationMinutes),
          scheduleStartAt: startAt,
          scheduleEndAt: endAt,
        },
      }
    );

    await logAdminActivity({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "REOPEN_GROUP",
      groupId,
      details: `Reopened group ${groupId} for ${durationMinutes} minutes`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "GD Group reopened successfully.",
        groupId,
        status: "open",
        date,
        time,
        duration: String(durationMinutes),
        scheduleStartAt: startAt,
        scheduleEndAt: endAt,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error reopening GD group:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";
import { GDAdminActivity } from "@/models/GDAdminActivity";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedLimit = Number(searchParams.get("limit") || 25);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 25;

    const activity = await GDAdminActivity.find({ adminId: admin.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("Admin activity error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

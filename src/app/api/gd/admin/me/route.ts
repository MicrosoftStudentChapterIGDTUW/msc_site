import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";

export async function GET() {
  try {
    await connectToDatabase();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error("Admin me error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

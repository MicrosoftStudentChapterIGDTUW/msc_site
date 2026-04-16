import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDAdmin } from "@/models/GDAdmin";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/gdAdminAuth";
import { logAdminActivity } from "@/lib/gdAdminActivity";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await GDAdmin.findOne({ email });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    await logAdminActivity({
      adminId: String(admin._id),
      adminEmail: admin.email,
      action: "LOGIN",
      details: "Logged into the admin portal",
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: String(admin._id),
        name: admin.name,
        email: admin.email,
      },
    });

    setSessionCookie(response, createSessionToken(String(admin._id), admin.email));
    return response;
  } catch (error) {
    console.error("Login admin error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

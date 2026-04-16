import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDAdmin } from "@/models/GDAdmin";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/gdAdminAuth";
import { logAdminActivity } from "@/lib/gdAdminActivity";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existing = await GDAdmin.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Admin with this email already exists." },
        { status: 409 }
      );
    }

    const created = await GDAdmin.create({
      name,
      email,
      passwordHash: hashPassword(password),
      lastLoginAt: new Date(),
    });

    await logAdminActivity({
      adminId: String(created._id),
      adminEmail: created.email,
      action: "REGISTER",
      details: "Registered a new admin account",
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: String(created._id),
        name: created.name,
        email: created.email,
      },
    });

    setSessionCookie(response, createSessionToken(String(created._id), created.email));
    return response;
  } catch (error) {
    console.error("Register admin error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

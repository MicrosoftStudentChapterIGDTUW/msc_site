import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/gdAdminAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GDAdmin } from "@/models/GDAdmin";

const COOKIE_NAME = "gd_admin_session";
const SESSION_DAYS = 7;

function getSecret(): string {
  return (
    process.env.GD_ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.MONGODB_URI ||
    "dev-only-secret"
  );
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const computedHash = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(originalHash, "hex");
  const b = Buffer.from(computedHash, "hex");

  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  exp: number;
}

export function createSessionToken(adminId: string, email: string): string {
  const payload: AdminSessionPayload = {
    adminId,
    email,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): AdminSessionPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const sigA = Buffer.from(signature);
  const sigB = Buffer.from(expectedSignature);

  if (sigA.length !== sigB.length || !timingSafeEqual(sigA, sigB)) {
    return null;
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
    if (!decoded.adminId || !decoded.email || !decoded.exp) return null;
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifySessionToken(token);
  if (!session) return null;

  const admin = await GDAdmin.findById(session.adminId).lean();
  if (!admin) return null;

  return {
    id: String(admin._id),
    name: admin.name,
    email: admin.email,
  };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

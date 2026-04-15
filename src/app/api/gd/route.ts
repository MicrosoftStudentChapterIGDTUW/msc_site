import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";
import { logAdminActivity } from "@/lib/gdAdminActivity";
import { v4 as uuidv4 } from "uuid";

// Generate a random, readable short ID for groups (e.g., A7X9Q)
function generateShortId(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

/**
 * POST /api/gd
 * Create a new GD Session
 */
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      topic,
      date,
      time,
      duration,
      scheduleStartAt,
      scheduleEndAt,
      participants: participantNames,
    } = body;
    
    if (!participantNames || !Array.isArray(participantNames) || participantNames.length === 0) {
      return NextResponse.json(
        { success: false, error: "A valid array of participant names is required." },
        { status: 400 }
      );
    }

    if (!topic || typeof topic !== "string" || topic.trim() === "") {
      return NextResponse.json(
        { success: false, error: "A valid GD Topic is required." },
        { status: 400 }
      );
    }

    // Minimum 2 participants required for a GD
    if (participantNames.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 participants are required for a GD." },
        { status: 400 }
      );
    }

    // Trim and validate names: no empty or whitespace-only names
    const trimmedNames: string[] = participantNames.map((name: string) => 
      typeof name === "string" ? name.trim() : ""
    );
    
    if (trimmedNames.some((name: string) => name.length === 0)) {
       return NextResponse.json(
        { success: false, error: "Participant names cannot be empty." },
        { status: 400 }
      );
    }

    // Check for duplicate names (case-insensitive)
    const lowerNames = trimmedNames.map((n: string) => n.toLowerCase());
    const uniqueNames = new Set(lowerNames);
    if (uniqueNames.size !== lowerNames.length) {
      return NextResponse.json(
        { success: false, error: "Duplicate participant names are not allowed." },
        { status: 400 }
      );
    }

    // Map names to participant objects with unique IDs
    const participants = trimmedNames.map((name: string) => ({
      id: uuidv4(),
      name: name,
      hasSubmitted: false,
    }));

    // Generate groupId with collision retry (max 5 attempts)
    let groupId = "";
    let createdGroup = null;
    
    for (let attempt = 0; attempt < 5; attempt++) {
      groupId = generateShortId();
      try {
        createdGroup = await GDGroup.create({
          groupId,
          topic: topic.trim(),
          date,
          time,
          duration,
          scheduleStartAt: typeof scheduleStartAt === "string" ? new Date(scheduleStartAt) : undefined,
          scheduleEndAt: typeof scheduleEndAt === "string" ? new Date(scheduleEndAt) : undefined,
          status: "open",
          createdByAdminId: admin.id,
          createdByAdminEmail: admin.email,
          participants,
        });
        break;
      } catch (err: any) {
        // If duplicate key error on groupId, retry with a new ID
        if (err.code === 11000) {
          continue;
        }
        throw err; // Re-throw non-collision errors
      }
    }

    if (!createdGroup) {
      return NextResponse.json(
        { success: false, error: "Failed to generate a unique Group ID. Please try again." },
        { status: 500 }
      );
    }

    await logAdminActivity({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "CREATE_GROUP",
      groupId,
      details: `Created GD group with ${participants.length} participants`,
    });

    return NextResponse.json(
      {
        success: true,
        groupId,
        status: createdGroup.status,
        participants: createdGroup.participants,
        topic: createdGroup.topic,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating GD Session:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gd
 * Fetch all GD Sessions (Admin)
 */
export async function GET() {
  try {
    await connectToDatabase();
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized admin access." },
        { status: 401 }
      );
    }
    
    // Sort by createdAt descending (newest first)
    const groups = await GDGroup.find({ createdByAdminId: admin.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: groups });
  } catch (error: any) {
    console.error("Error fetching GD Sessions:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

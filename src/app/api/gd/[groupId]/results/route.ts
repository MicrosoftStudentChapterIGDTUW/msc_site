import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GDGroup } from "@/models/GDGroup";
import { GDEvaluation } from "@/models/GDEvaluation";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";
import { logAdminActivity } from "@/lib/gdAdminActivity";

/**
 * GET /api/gd/[groupId]/results
 * Fetch all evaluations for a GD group (Admin Only)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
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

    const evaluations = await GDEvaluation.find({ groupId }).lean();
    const additionalFromArray = group.additionalEvaluators || [];
    const additionalEvaluatorIdsSet = new Set<string>([
      ...(group.additionalEvaluatorIds || []).map((id) => String(id)),
      ...additionalFromArray.map((participant) => String(participant.id)),
    ]);
    const additionalFromParticipants = (group.participants || []).filter(
      (participant) =>
        participant.isAdditionalEvaluator || additionalEvaluatorIdsSet.has(String(participant.id))
    );
    const coreParticipants = (group.participants || []).filter(
      (participant) =>
        !participant.isAdditionalEvaluator && !additionalEvaluatorIdsSet.has(String(participant.id))
    );
    const mergedAdditional = additionalFromArray.length > 0 ? additionalFromArray : additionalFromParticipants;

    await logAdminActivity({
      adminId: admin.id,
      adminEmail: admin.email,
      action: "VIEW_RESULTS",
      groupId,
      details: `Viewed results for group ${groupId}`,
    });

    return NextResponse.json(
      {
        success: true,
        groupId: group.groupId,
        status: group.status,
        participants: coreParticipants,
        additionalEvaluatorIds: mergedAdditional.map((participant) => String(participant.id)),
        additionalEvaluators: mergedAdditional,
        evaluations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching results:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

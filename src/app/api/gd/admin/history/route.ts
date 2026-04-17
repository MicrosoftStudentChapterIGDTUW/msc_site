import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedAdmin } from "@/lib/gdAdminAuth";
import { GDGroup } from "@/models/GDGroup";
import { GDEvaluation } from "@/models/GDEvaluation";

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

    const groups = await GDGroup.find({ createdByAdminId: admin.id })
      .sort({ createdAt: -1 })
      .lean();

    const groupIds = groups.map((g) => g.groupId);
    const counts = await GDEvaluation.aggregate([
      { $match: { groupId: { $in: groupIds } } },
      { $group: { _id: "$groupId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    for (const item of counts) {
      countMap.set(String(item._id), Number(item.count));
    }

    const data = groups.map((group) => {
      const additionalFromArray = group.additionalEvaluators || [];
      const additionalEvaluatorIds = new Set<string>([
        ...(group.additionalEvaluatorIds || []).map((id) => String(id)),
        ...additionalFromArray.map((participant) => String(participant.id)),
      ]);
      const coreParticipants = group.participants.filter(
        (p) => !p.isAdditionalEvaluator && !additionalEvaluatorIds.has(String(p.id))
      );
      const additionalFromParticipants = group.participants.filter(
        (p) => p.isAdditionalEvaluator || additionalEvaluatorIds.has(String(p.id))
      );
      const mergedAdditional = additionalFromArray.length > 0 ? additionalFromArray : additionalFromParticipants;
      const submittedCount = coreParticipants.filter((p) => p.hasSubmitted).length;
      return {
        groupId: group.groupId,
        topic: group.topic,
        date: group.date,
        time: group.time,
        duration: group.duration,
        status: group.status,
        participants: [...coreParticipants, ...mergedAdditional],
        submittedCount,
        totalParticipants: coreParticipants.length,
        additionalEvaluatorCount: mergedAdditional.length,
        additionalEvaluators: mergedAdditional,
        evaluationCount: countMap.get(group.groupId) || 0,
        createdAt: group.createdAt,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Admin history error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

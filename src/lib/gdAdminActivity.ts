import { GDAdminActivity, type AdminActivityAction } from "@/models/GDAdminActivity";

interface LogAdminActivityInput {
  adminId: string;
  adminEmail: string;
  action: AdminActivityAction;
  groupId?: string;
  details?: string;
}

export async function logAdminActivity(input: LogAdminActivityInput) {
  await GDAdminActivity.create({
    adminId: input.adminId,
    adminEmail: input.adminEmail,
    action: input.action,
    groupId: input.groupId,
    details: input.details,
  });
}

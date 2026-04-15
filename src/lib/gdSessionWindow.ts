interface GroupScheduleInput {
  date?: string;
  time?: string;
  duration?: string;
  scheduleStartAt?: string | Date;
  scheduleEndAt?: string | Date;
}

export type SessionWindowCode = "active" | "not_started" | "expired" | "unscheduled";

export interface SessionWindowState {
  code: SessionWindowCode;
  isActive: boolean;
  message: string;
  startAt?: Date;
  endAt?: Date;
}

function parseSessionDateTime(date?: string, time?: string): Date | null {
  if (!date || !time) return null;
  const stamp = `${date}T${time}:00`;
  const parsed = new Date(stamp);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseDurationMinutes(duration?: string): number | null {
  if (!duration) return null;
  const parsed = Number(duration);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export function getSessionWindowState(group: GroupScheduleInput): SessionWindowState {
  let startAt: Date | null = null;
  let endAt: Date | null = null;

  if (group.scheduleStartAt && group.scheduleEndAt) {
    const parsedStart = new Date(group.scheduleStartAt);
    const parsedEnd = new Date(group.scheduleEndAt);
    if (!Number.isNaN(parsedStart.getTime()) && !Number.isNaN(parsedEnd.getTime())) {
      startAt = parsedStart;
      endAt = parsedEnd;
    }
  }

  if (!startAt || !endAt) {
    const fallbackStart = parseSessionDateTime(group.date, group.time);
    const durationMinutes = parseDurationMinutes(group.duration);

    if (!fallbackStart || !durationMinutes) {
      return {
        code: "unscheduled",
        isActive: true,
        message: "Session schedule is incomplete. Access allowed.",
      };
    }

    startAt = fallbackStart;
    endAt = new Date(fallbackStart.getTime() + durationMinutes * 60 * 1000);
  }

  const now = new Date();

  if (now < startAt) {
    return {
      code: "not_started",
      isActive: false,
      message: "This GD evaluation has not started yet.",
      startAt,
      endAt,
    };
  }

  if (now > endAt) {
    return {
      code: "expired",
      isActive: false,
      message: "This GD evaluation window is over.",
      startAt,
      endAt,
    };
  }

  return {
    code: "active",
    isActive: true,
    message: "Session is active.",
    startAt,
    endAt,
  };
}

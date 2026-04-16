"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Copy,
  LogOut,
  Plus,
  RefreshCw,
  X,
  Eye,
  Shield,
  Activity,
  History,
  RotateCcw,
} from "lucide-react";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";

interface FormData {
  topic: string;
  date: string;
  time: string;
  duration: string;
}

interface ParticipantStatus {
  name: string;
  submitted: boolean;
  joined: boolean;
}

interface GroupData {
  groupId: string;
  participantStatuses: ParticipantStatus[];
  date?: string;
  time?: string;
  duration?: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface GroupHistoryItem {
  groupId: string;
  topic: string;
  date?: string;
  time?: string;
  duration?: string;
  status: "open" | "closed";
  submittedCount: number;
  totalParticipants: number;
  evaluationCount: number;
  createdAt: string;
}

interface ActivityItem {
  _id: string;
  action: string;
  groupId?: string;
  details?: string;
  createdAt: string;
}

interface EvaluationItem {
  evaluatorId: string;
  evaluateeId: string;
  ratings: number[];
  contributionType: string;
  isTeamPlayer: boolean;
  strength: string;
  improvement: string;
}

interface ResultsResponse {
  groupId: string;
  status: "open" | "closed";
  participants: { id: string; name: string }[];
  evaluations: EvaluationItem[];
}

const defaultFormData: FormData = {
  topic: "",
  date: "",
  time: "",
  duration: "",
};

function toParticipantStatuses(
  participants: { name: string; hasSubmitted: boolean; isJoined?: boolean }[]
): ParticipantStatus[] {
  return participants.map((p) => ({
    name: p.name,
    submitted: Boolean(p.hasSubmitted),
    joined: Boolean(p.isJoined),
  }));
}

function prettyActivity(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildScheduleWindow(date: string, time: string, duration: string) {
  if (!date || !time || !duration) {
    return { scheduleStartAt: undefined, scheduleEndAt: undefined };
  }

  const start = new Date(`${date}T${time}:00`);
  const durationMinutes = Number(duration);
  if (Number.isNaN(start.getTime()) || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return { scheduleStartAt: undefined, scheduleEndAt: undefined };
  }

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return {
    scheduleStartAt: start.toISOString(),
    scheduleEndAt: end.toISOString(),
  };
}

export default function GDAdminPage() {
  const [nowTick, setNowTick] = useState(Date.now());
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [reopeningGroupId, setReopeningGroupId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);

  const [historyLoading, setHistoryLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState<GroupHistoryItem[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  const [selectedResultsGroupId, setSelectedResultsGroupId] = useState<string | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsResponse | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<FormData>(defaultFormData);
  const [editParticipants, setEditParticipants] = useState<string[]>([]);
  const [editParticipantInput, setEditParticipantInput] = useState("");
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);

  const submittedCount =
    groupData?.participantStatuses.filter((p) => p.submitted).length ?? 0;
  const totalCount =
    groupData?.participantStatuses.length ?? participants.length;

  const currentSessions = useMemo(
    () => historyItems.filter((item) => item.status === "open"),
    [historyItems]
  );

  const scoreByParticipant = useMemo(() => {
    if (!resultsData) return [] as { name: string; average: number; count: number }[];

    const stats = new Map<string, { sum: number; count: number }>();
    for (const participant of resultsData.participants) {
      stats.set(participant.id, { sum: 0, count: 0 });
    }

    for (const evaluation of resultsData.evaluations) {
      const target = stats.get(evaluation.evaluateeId);
      if (!target || !evaluation.ratings.length) continue;
      const total = evaluation.ratings.reduce((acc, val) => acc + val, 0);
      const avg = total / evaluation.ratings.length;
      target.sum += avg;
      target.count += 1;
    }

    return resultsData.participants.map((participant) => {
      const stat = stats.get(participant.id);
      const average = stat && stat.count > 0 ? stat.sum / stat.count : 0;
      return {
        name: participant.name,
        average,
        count: stat?.count || 0,
      };
    });
  }, [resultsData]);

  useEffect(() => {
    void bootstrapAdmin();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function getCountdownState(date?: string, time?: string, duration?: string) {
    if (!date || !time || !duration) {
      return { label: "Schedule pending", tone: "text-gray-400 border-white/20 bg-white/5" };
    }

    const start = new Date(`${date}T${time}:00`);
    const durationMinutes = Number(duration);
    if (Number.isNaN(start.getTime()) || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      return { label: "Schedule pending", tone: "text-gray-400 border-white/20 bg-white/5" };
    }

    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    const now = new Date(nowTick);

    const format = (target: Date) => {
      const ms = Math.max(target.getTime() - now.getTime(), 0);
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
      return `${minutes}m ${seconds}s`;
    };

    if (now < start) {
      return {
        label: `Starts in ${format(start)}`,
        tone: "text-amber-300 border-amber-300/30 bg-amber-400/10",
      };
    }

    if (now > end) {
      return {
        label: "Session ended",
        tone: "text-red-300 border-red-300/30 bg-red-400/10",
      };
    }

    return {
      label: `Ends in ${format(end)}`,
      tone: "text-emerald-300 border-emerald-300/30 bg-emerald-400/10",
    };
  }

  async function bootstrapAdmin() {
    try {
      const meRes = await fetch("/api/gd/admin/me", { cache: "no-store" });
      if (!meRes.ok) return;
      const meData = await meRes.json();
      if (meData?.success && meData?.admin) {
        setAdmin(meData.admin);
        await Promise.all([fetchHistory(), fetchActivity()]);
      }
    } catch {
      // Keep admin as null and show auth form.
    }
  }

  async function fetchHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/gd/admin/history", { cache: "no-store" });
      if (res.status === 401) {
        setAdmin(null);
        setHistoryItems([]);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load history.");
      setHistoryItems(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load history.");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function fetchActivity() {
    setActivityLoading(true);
    try {
      const res = await fetch("/api/gd/admin/activity?limit=30", { cache: "no-store" });
      if (res.status === 401) {
        setAdmin(null);
        setActivityItems([]);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load activity.");
      setActivityItems(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load activity.");
    } finally {
      setActivityLoading(false);
    }
  }

  async function handleAuth() {
    if (!authEmail.trim() || !authPassword.trim()) return;
    if (authMode === "register" && !authName.trim()) return;

    setAuthLoading(true);
    setError(null);

    try {
      const endpoint = authMode === "login" ? "/api/gd/admin/login" : "/api/gd/admin/register";
      const payload =
        authMode === "login"
          ? { email: authEmail.trim(), password: authPassword }
          : { name: authName.trim(), email: authEmail.trim(), password: authPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      setAdmin(data.admin);
      setAuthPassword("");
      await Promise.all([fetchHistory(), fetchActivity()]);
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/gd/admin/logout", { method: "POST" });
    } finally {
      setAdmin(null);
      setStep(1);
      setGroupData(null);
      setHistoryItems([]);
      setActivityItems([]);
      setResultsData(null);
      setSelectedResultsGroupId(null);
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAddParticipant = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (participants.includes(trimmed)) {
      setError("Participant already added.");
      return;
    }
    setParticipants((prev) => [...prev, trimmed]);
    setInputValue("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  const handleRemove = (name: string) => {
    setParticipants((prev) => prev.filter((p) => p !== name));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim() || participants.length < 2) return;
    setIsLoading(true);
    setError(null);

    try {
      const schedule = buildScheduleWindow(formData.date, formData.time, formData.duration);
      const res = await fetch("/api/gd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...schedule, participants }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create group.");
      }

      setGroupData({
        groupId: data.groupId,
        participantStatuses: toParticipantStatuses(data.participants || []),
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
      });
      setEditingSessionId(data.groupId);
      setEditFormData({
        topic: formData.topic,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
      });
      setEditParticipants([...participants]);
      setStep(2);
      await Promise.all([fetchHistory(), fetchActivity()]);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!groupData || isRefreshing) return;
    setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch(`/api/gd/${groupData.groupId}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to refresh status.");
      }

      setGroupData((prev) =>
        prev
          ? {
              ...prev,
              participantStatuses: toParticipantStatuses(data.participants || []),
              date: data.date,
              time: data.time,
              duration: data.duration,
            }
          : prev
      );
      await Promise.all([fetchHistory(), fetchActivity()]);
    } catch (err: any) {
      setError(err.message || "Failed to refresh status.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseEarly = async () => {
    if (!groupData || isClosing) return;
    const confirmed = window.confirm(
      "Close this GD early? No more responses will be accepted."
    );
    if (!confirmed) return;

    setIsClosing(true);
    setError(null);

    try {
      const res = await fetch(`/api/gd/${groupData.groupId}/force-close`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to close the GD.");
      }

      await Promise.all([handleRefresh(), fetchHistory(), fetchActivity()]);
    } catch (err: any) {
      setError(err.message || "Failed to close the GD.");
    } finally {
      setIsClosing(false);
    }
  };

  const handleCopy = () => {
    if (!groupData) return;
    navigator.clipboard.writeText(groupData.groupId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleReopenSession(groupId: string) {
    if (reopeningGroupId) return;

    const durationInput = window.prompt(
      `Reopen session ${groupId} for how many minutes?`,
      "20"
    );
    if (durationInput === null) return;

    const durationMinutes = Number(durationInput.trim());
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      setError("Please enter a valid reopen duration in minutes.");
      return;
    }

    setReopeningGroupId(groupId);
    setError(null);

    try {
      const res = await fetch(`/api/gd/${groupId}/reopen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reopen session.");
      }

      await Promise.all([fetchHistory(), fetchActivity()]);
      await handleSelectCurrentSession(groupId);
    } catch (err: any) {
      setError(err.message || "Failed to reopen session.");
    } finally {
      setReopeningGroupId(null);
    }
  }

  async function handleViewResults(groupId: string) {
    setSelectedResultsGroupId(groupId);
    setResultsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/gd/${groupId}/results`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load results.");
      }

      setResultsData(data as ResultsResponse);
      await fetchActivity();
    } catch (err: any) {
      setError(err.message || "Failed to load results.");
      setResultsData(null);
    } finally {
      setResultsLoading(false);
    }
  }

  async function handleSelectCurrentSession(groupId: string) {
    setEditingSessionId(groupId);
    setError(null);

    const target = historyItems.find((item) => item.groupId === groupId);
    if (target) {
      setEditFormData({
        topic: target.topic || "",
        date: target.date || "",
        time: target.time || "",
        duration: target.duration || "",
      });
    }

    try {
      const res = await fetch(`/api/gd/${groupId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to load current session details.");
      }

      setGroupData({
        groupId,
        participantStatuses: toParticipantStatuses(data.participants || []),
        date: data.date,
        time: data.time,
        duration: data.duration,
      });
      setEditParticipants((data.participants || []).map((participant: { name: string }) => participant.name));
      setEditParticipantInput("");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Unable to load current session details.");
    }
  }

  async function handleUpdateCurrentSession() {
    if (!editingSessionId) return;

    setIsUpdatingSession(true);
    setError(null);

    try {
      if (editParticipants.length < 2) {
        throw new Error("At least 2 participants are required.");
      }

      const schedule = buildScheduleWindow(editFormData.date, editFormData.time, editFormData.duration);
      const res = await fetch(`/api/gd/${editingSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, ...schedule, participants: editParticipants }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update session.");
      }

      await Promise.all([fetchHistory(), fetchActivity()]);
      if (groupData?.groupId === editingSessionId) {
        await handleRefresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update session.");
    } finally {
      setIsUpdatingSession(false);
    }
  }

  const handleAddEditParticipant = () => {
    const trimmed = editParticipantInput.trim();
    if (!trimmed) return;

    const exists = editParticipants.some(
      (participant) => participant.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setError("Participant already added.");
      return;
    }

    setEditParticipants((prev) => [...prev, trimmed]);
    setEditParticipantInput("");
    setError(null);
  };

  const handleRemoveEditParticipant = (name: string) => {
    setEditParticipants((prev) => prev.filter((participant) => participant !== name));
    setError(null);
  };

  return (
    <>
      <div className="background-with-svg" id="top" />
      <Aurora
        colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
        blend={1}
        amplitude={1.0}
        speed={1}
      />
      <PillNav
        logo="/logo.png"
        logoAlt="MSC Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/#about" },
          { label: "Events", href: "/events" },
          { label: "Blogs", href: "/blog" },
          { label: "Sponsors", href: "/sponsors" },
          { label: "Team", href: "/team" },
          { label: "Contact us", href: "/contact" },
          { label: "FAQ", href: "/#faq" },
        ]}
        activeHref="/events"
        baseColor="#0066cc"
        pillColor="#0066cc"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#ffffff"
      />

      <div className="min-h-screen text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#4da6ff]/10 border border-[#4da6ff]/30 rounded-full px-4 py-1.5 text-sm text-[#4da6ff] mb-3">
                <Shield className="w-4 h-4" />
                Admin Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                GD Control Center
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Secure multi-admin portal with session tracking, history, and results.
              </p>
            </div>

            {admin && (
              <div className="text-right">
                <p className="text-sm text-white font-semibold">{admin.name}</p>
                <p className="text-xs text-gray-400">{admin.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:border-red-400/40 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!admin && (
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5">
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    authMode === "login" ? "bg-[#4da6ff] text-white" : "text-gray-300"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    authMode === "register" ? "bg-[#4da6ff] text-white" : "text-gray-300"
                  }`}
                >
                  Register
                </button>
              </div>

              {authMode === "register" && (
                <input
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Admin name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                />
              )}

              <input
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Admin email"
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
              />

              <input
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
              />

              <button
                onClick={handleAuth}
                disabled={
                  authLoading ||
                  !authEmail.trim() ||
                  !authPassword.trim() ||
                  (authMode === "register" && !authName.trim())
                }
                className="w-full bg-[#4da6ff] hover:bg-[#4da6ff]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                {authLoading ? "Please wait..." : authMode === "login" ? "Login" : "Create admin account"}
              </button>
            </div>
          )}

          {admin && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#4da6ff]" : "bg-white/10"}`} />
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 2 ? "bg-emerald-400" : "bg-white/10"}`} />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">
                      GD Topic / Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={formData.topic}
                      onChange={(e) => handleChange("topic", e.target.value)}
                      placeholder="e.g. AI in Healthcare — Batch A"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Scheduled Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4da6ff]/60 [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Start Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleChange("time", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4da6ff]/60 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleChange("duration", e.target.value)}
                      placeholder="e.g. 30"
                      min={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">
                      Participants <span className="text-red-400">*</span>{" "}
                      <span className="text-gray-500">(min. 2)</span>
                    </label>

                    {participants.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {participants.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 bg-[#4da6ff]/10 border border-[#4da6ff]/25 text-[#4da6ff] text-xs rounded-lg px-3 py-1.5"
                          >
                            {name}
                            <button onClick={() => handleRemove(name)} className="hover:text-white transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a name and press Enter"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                      />
                      <button
                        onClick={handleAddParticipant}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm px-4 py-2.5 rounded-xl"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={!formData.topic.trim() || participants.length < 2 || isLoading}
                    className="w-full bg-[#4da6ff] hover:bg-[#4da6ff]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      "Generate Group ID"
                    )}
                  </button>
                </div>

                {step === 2 && groupData && (
                  <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-emerald-500/20 p-6 sm:p-8 text-center">
                      <div className="mb-3 flex justify-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${getCountdownState(
                            groupData.date,
                            groupData.time,
                            groupData.duration
                          ).tone}`}
                        >
                          {getCountdownState(groupData.date, groupData.time, groupData.duration).label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Group ID</p>
                      <p className="text-5xl font-bold tracking-[0.2em] text-emerald-400 font-mono mb-2">
                        {groupData.groupId}
                      </p>
                      <p className="text-gray-400 text-xs mb-5">
                        Active until all {totalCount} participants submit
                      </p>
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-sm px-5 py-2.5 rounded-xl"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy Group ID"}
                      </button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold">Submission Status</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-400">
                            {submittedCount} / {totalCount} submitted
                          </span>
                          <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {groupData.participantStatuses.map((p) => (
                          <div key={p.name} className="bg-white/5 rounded-xl border border-white/10 px-3 py-2.5 flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.submitted ? "bg-emerald-400" : p.joined ? "bg-amber-400" : "bg-gray-600"}`} />
                            <span className="text-sm text-gray-300 truncate">{p.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={handleCloseEarly}
                          disabled={isClosing}
                          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 text-sm font-medium py-3 rounded-xl disabled:opacity-50"
                        >
                          {isClosing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                          Close GD Early
                        </button>
                        <button
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium py-3 rounded-xl disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                          Refresh Status
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5">
                  <div className="flex items-center gap-2 mb-3 text-[#4da6ff]">
                    <History className="w-4 h-4" />
                    <h3 className="text-sm font-semibold">Your GD History</h3>
                  </div>
                  {historyLoading ? (
                    <p className="text-sm text-gray-400">Loading history...</p>
                  ) : historyItems.length === 0 ? (
                    <p className="text-sm text-gray-500">No sessions yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                      {historyItems.map((item) => (
                        <div key={item.groupId} className="border border-white/10 rounded-xl p-3 bg-white/5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{item.topic}</p>
                              <p className="text-xs text-gray-400">{item.groupId} · {new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.status === "closed" && (
                                <button
                                  onClick={() => handleReopenSession(item.groupId)}
                                  disabled={reopeningGroupId === item.groupId}
                                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-50"
                                >
                                  <RotateCcw className={`w-3.5 h-3.5 ${reopeningGroupId === item.groupId ? "animate-spin" : ""}`} />
                                  {reopeningGroupId === item.groupId ? "Reopening..." : "Revoke Close"}
                                </button>
                              )}
                              <button
                                onClick={() => handleViewResults(item.groupId)}
                                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-[#4da6ff]/40 text-[#4da6ff] hover:bg-[#4da6ff]/10"
                              >
                                <Eye className="w-3.5 h-3.5" /> Results
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-300 flex flex-wrap gap-3">
                            <span>Status: <span className={item.status === "closed" ? "text-emerald-400" : "text-amber-400"}>{item.status}</span></span>
                            <span>Submitted: {item.submittedCount}/{item.totalParticipants}</span>
                            <span>Evaluations: {item.evaluationCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 lg:sticky lg:top-24 self-start">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-[#4da6ff]">Current Sessions</h3>
                    <span className="text-xs text-gray-400">{currentSessions.length} active</span>
                  </div>

                  {historyLoading ? (
                    <p className="text-sm text-gray-400">Loading current sessions...</p>
                  ) : currentSessions.length === 0 ? (
                    <p className="text-sm text-gray-500">No active sessions right now.</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-auto pr-1 mb-4">
                      {currentSessions.map((item) => (
                        <button
                          key={item.groupId}
                          type="button"
                          onClick={() => handleSelectCurrentSession(item.groupId)}
                          className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                            editingSessionId === item.groupId
                              ? "border-[#4da6ff]/50 bg-[#4da6ff]/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-white font-medium truncate">{item.topic}</p>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${getCountdownState(
                                item.date,
                                item.time,
                                item.duration
                              ).tone}`}
                            >
                              {getCountdownState(item.date, item.time, item.duration).label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.groupId} · {item.submittedCount}/{item.totalParticipants} submitted
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {editingSessionId && (
                    <div className="space-y-3 border-t border-white/10 pt-4">
                      <p className="text-xs text-gray-400">Editing session {editingSessionId}</p>
                      <input
                        value={editFormData.topic}
                        onChange={(e) =>
                          setEditFormData((prev) => ({ ...prev, topic: e.target.value }))
                        }
                        placeholder="Topic"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={editFormData.date}
                          onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, date: e.target.value }))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4da6ff]/60 [color-scheme:dark]"
                        />
                        <input
                          type="time"
                          value={editFormData.time}
                          onChange={(e) =>
                            setEditFormData((prev) => ({ ...prev, time: e.target.value }))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4da6ff]/60 [color-scheme:dark]"
                        />
                      </div>
                      <input
                        type="number"
                        min={5}
                        value={editFormData.duration}
                        onChange={(e) =>
                          setEditFormData((prev) => ({ ...prev, duration: e.target.value }))
                        }
                        placeholder="Duration in minutes"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                      />

                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-xs text-gray-300">Participants</p>
                          <span className="text-[11px] text-gray-400">{editParticipants.length} total</span>
                        </div>

                        {editParticipants.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {editParticipants.map((name) => (
                              <span
                                key={name}
                                className="inline-flex items-center gap-1.5 bg-[#4da6ff]/10 border border-[#4da6ff]/25 text-[#4da6ff] text-xs rounded-lg px-2.5 py-1"
                              >
                                {name}
                                <button
                                  onClick={() => handleRemoveEditParticipant(name)}
                                  className="hover:text-white transition-colors"
                                  aria-label={`Remove ${name}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input
                            value={editParticipantInput}
                            onChange={(e) => {
                              setEditParticipantInput(e.target.value);
                              setError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddEditParticipant();
                              }
                            }}
                            placeholder="Add participant"
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60"
                          />
                          <button
                            onClick={handleAddEditParticipant}
                            className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs px-3 py-2 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleUpdateCurrentSession}
                        disabled={isUpdatingSession}
                        className="w-full bg-[#4da6ff] hover:bg-[#4da6ff]/90 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                      >
                        {isUpdatingSession ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
                          </>
                        ) : (
                          "Save Session Changes"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-[#4da6ff]">GD Results Snapshot</h3>
                    {selectedResultsGroupId && (
                      <span className="text-[11px] text-[#4da6ff] border border-[#4da6ff]/30 bg-[#4da6ff]/10 px-2 py-0.5 rounded-full">
                        {selectedResultsGroupId}
                      </span>
                    )}
                  </div>
                  {!selectedResultsGroupId && (
                    <p className="text-sm text-gray-500">Pick a session from history to view detailed results.</p>
                  )}
                  {resultsLoading && <p className="text-sm text-gray-400">Loading results...</p>}

                  {!resultsLoading && resultsData && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400">Group: {resultsData.groupId}</p>
                      {scoreByParticipant.length === 0 ? (
                        <p className="text-sm text-gray-500">No evaluations submitted yet.</p>
                      ) : (
                        [...scoreByParticipant]
                          .sort((a, b) => b.average - a.average)
                          .map((item, index) => (
                          <div key={item.name} className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white font-medium">#{index + 1} {item.name}</span>
                              <span className="text-[#4da6ff]">
                                {item.count > 0 ? `${item.average.toFixed(2)} / 5` : "No score"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Based on {item.count} peer evaluations</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-2 mb-3 text-[#4da6ff]">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <h3 className="text-sm font-semibold">Recent Activity</h3>
                    </div>
                    <span className="text-[11px] text-gray-400">latest {activityItems.length}</span>
                  </div>

                  {activityLoading ? (
                    <p className="text-sm text-gray-400">Loading activity...</p>
                  ) : activityItems.length === 0 ? (
                    <p className="text-sm text-gray-500">No activity yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-auto pr-1">
                      {activityItems.map((item) => (
                        <div key={item._id} className="border border-white/10 rounded-lg p-2.5 bg-white/5">
                          <p className="text-xs text-white font-medium">{prettyActivity(item.action)}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleString()}</p>
                          {item.groupId && (
                            <p className="text-[11px] text-[#4da6ff] mt-1">Group: {item.groupId}</p>
                          )}
                          {item.details && (
                            <p className="text-[11px] text-gray-300 mt-1 line-clamp-2">{item.details}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

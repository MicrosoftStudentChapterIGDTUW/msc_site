"use client";

import { useState } from "react";
import { X, Plus, Copy, RefreshCw, LogOut, AlertCircle } from "lucide-react";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";

// ─────────────────────────────────────────────────────────────────────────────
// Toggle to false when the backend is ready. Nothing else needs to change.
const USE_MOCK = true;
// ─────────────────────────────────────────────────────────────────────────────

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
}

// Generates a random GD-XXXX id for mock mode
function generateMockId() {
  return "GD-" + Math.floor(1000 + Math.random() * 9000);
}

export default function GDAdminPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    date: "",
    time: "",
    duration: "",
  });
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);

  const submittedCount =
    groupData?.participantStatuses.filter((p) => p.submitted).length ?? 0;
  const totalCount =
    groupData?.participantStatuses.length ?? participants.length;

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
      let groupId: string;

      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        groupId = generateMockId();

        // Persist to localStorage so the join page can look up this group
        const session = {
          groupId,
          topic: formData.topic,
          peers: participants.map((name, i) => ({
            id: `p${i}`,
            name,
            initials: name
              .split(" ")
              .map((w) => w[0]?.toUpperCase() ?? "")
              .join("")
              .slice(0, 2),
          })),
        };
        localStorage.setItem(`gd_session_${groupId}`, JSON.stringify(session));
      } else {
        const res = await fetch("/api/gd/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, participants }),
        });
        if (!res.ok) throw new Error("Failed to create group.");
        const data = await res.json();
        groupId = data.groupId;
      }

      setGroupData({
        groupId,
        participantStatuses: participants.map((name) => ({
          name,
          submitted: false,
          joined: false,
        })),
      });
      setStep(2);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!groupData || isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (!USE_MOCK) {
        const res = await fetch(`/api/gd/${groupData.groupId}/status`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setGroupData((prev) =>
          prev ? { ...prev, participantStatuses: data.participantStatuses } : prev
        );
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch {
      setError("Failed to refresh status.");
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
    try {
      if (!USE_MOCK) {
        await fetch(`/api/gd/${groupData.groupId}/close`, { method: "POST" });
      } else {
        await new Promise((r) => setTimeout(r, 500));
        localStorage.removeItem(`gd_session_${groupData.groupId}`);
      }
      window.location.href = "/events";
    } catch {
      setError("Failed to close the GD.");
      setIsClosing(false);
    }
  };

  const handleCopy = () => {
    if (!groupData) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/gd/join?id=${groupData.groupId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[#4da6ff]/10 border border-[#4da6ff]/30 rounded-full px-4 py-1.5 text-sm text-[#4da6ff] mb-5">
              Admin Portal
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              {step === 1 ? "Create GD Group" : "Group Live"}
            </h1>
            <p className="text-gray-400 text-sm">
              {step === 1
                ? "Fill in the details and add all participant names."
                : "Share the Group ID with all participants before the GD begins."}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#4da6ff]" : "bg-white/10"}`} />
            <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 2 ? "bg-emerald-400" : "bg-white/10"}`} />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5">

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">
                  GD Topic / Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={formData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  placeholder="e.g. AI in Healthcare — Batch A"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4da6ff]/60 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Start Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4da6ff]/60 transition-colors [color-scheme:dark]"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60 transition-colors"
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
                    onChange={(e) => { setInputValue(e.target.value); setError(null); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a name and press Enter"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60 transition-colors"
                  />
                  <button
                    onClick={handleAddParticipant}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm px-4 py-2.5 rounded-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!formData.topic.trim() || participants.length < 2 || isLoading}
                className="w-full bg-[#4da6ff] hover:bg-[#4da6ff]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
                ) : (
                  "Generate Group ID →"
                )}
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && groupData && (
            <div className="space-y-4">

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-emerald-500/20 p-6 sm:p-8 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Group ID</p>
                <p className="text-5xl font-bold tracking-[0.2em] text-emerald-400 font-mono mb-2">
                  {groupData.groupId}
                </p>
                <p className="text-gray-400 text-xs mb-5">
                  Active until all {totalCount} participants submit · Share before the GD begins
                </p>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy shareable link"}
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Submission Status</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400">{submittedCount} / {totalCount} submitted</span>
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

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Submitted</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Joined</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-gray-600" /> Pending</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseEarly}
                  disabled={isClosing}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 text-sm font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isClosing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  Close GD Early
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Status
                </button>
              </div>

              <p className="text-center text-xs text-gray-500">
                The GD closes automatically once all {totalCount} participants submit
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
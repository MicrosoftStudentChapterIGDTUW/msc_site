"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, RefreshCw, AlertCircle } from "lucide-react";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";
import { useSearchParams } from "next/navigation";

const USE_MOCK = false;

const CONTRIBUTION_TYPES = [
  "Bringing new ideas",
  "Supporting others",
  "Asking questions",
  "Leading discussion",
];

const RATING_LABELS = [
  "Topic Understanding",
  "Clarity",
  "Confidence",
  "Listening",
  "Contribution Quality",
  "Respectfulness",
  "Critical Thinking",
];

interface Peer { id: string; name: string; initials: string; isAdditionalEvaluator?: boolean }
interface PeerEval {
  peerId: string; ratings: number[]; contribution: string;
  teamPlayer: boolean | null; strength: string; improvement: string;
}
interface SessionData {
  groupId: string;
  topic: string;
  peers: Peer[];
  participants?: Peer[];
  additionalEvaluators?: Peer[];
  date?: string;
  time?: string;
  duration?: string;
}
interface SubmissionStatus { name: string; submitted: boolean }

const defaultEval = (peerId: string): PeerEval => ({
  peerId, ratings: new Array(RATING_LABELS.length).fill(0),
  contribution: "", teamPlayer: null, strength: "", improvement: "",
});

// ── Small components ──────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string | string[] }) {
  const items = Array.isArray(message) ? message : [message];
  const isChecklist = Array.isArray(message);
  return (
    <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">
          {isChecklist ? "Please complete all fields before continuing." : items[0]}
        </span>
      </div>
      {isChecklist && items.length > 1 && (
        <ul className="mt-2 space-y-1 pl-6 list-disc text-red-400/80 text-xs">
          {items.map((m) => <li key={m}>{m}</li>)}
        </ul>
      )}
    </div>
  );
}

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-xs text-[#4da6ff]">{value > 0 ? `${value} / 5` : "—"}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val} onClick={() => onChange(val)}
            className={`flex-1 h-9 rounded-lg border text-sm font-medium transition-all duration-150 ${
              value >= val ? "bg-[#4da6ff]/15 border-[#4da6ff]/50 text-[#4da6ff]" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
            }`}
          >{val}</button>
        ))}
      </div>
    </div>
  );
}

function PageHeader({ badge, title, subtitle, right }: { badge: string; title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="inline-flex items-center gap-2 bg-[#4da6ff]/10 border border-[#4da6ff]/30 rounded-full px-4 py-1.5 text-sm text-[#4da6ff] mb-5">
        {badge}
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

function NameDropdown({ peers, value, onChange, disabled }: {
  peers: Peer[]; value: string; onChange: (v: string) => void; disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = peers.find((p) => p.name === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen((o) => !o); }}
        className={`w-full flex items-center justify-between gap-3 bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-left transition-colors ${
          disabled ? "opacity-40 cursor-not-allowed border-white/10" : open ? "border-[#4da6ff]/60" : "border-white/10 hover:border-white/20"
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#4da6ff]/20 border border-[#4da6ff]/30 flex items-center justify-center text-[10px] font-bold text-[#4da6ff] flex-shrink-0">
              {selected.initials}
            </span>
            <span className="text-white">{selected.name}</span>
          </span>
        ) : (
          <span className="text-gray-500">
            {disabled ? "Enter a valid Group ID first" : "Select your name…"}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1.5 w-full bg-[#111827] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {peers.map((p) => (
              <button
                key={p.id} type="button"
                onClick={() => { onChange(p.name); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5 ${
                  value === p.name ? "bg-[#4da6ff]/10 text-white" : "text-gray-300"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  value === p.name
                    ? "bg-[#4da6ff]/20 border border-[#4da6ff]/30 text-[#4da6ff]"
                    : "bg-white/10 border border-white/10 text-gray-400"
                }`}>
                  {p.initials}
                </span>
                {p.name}
                {value === p.name && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4da6ff]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GDJoinPage() {
  const peerHeaderRef = useRef<HTMLDivElement | null>(null);
  const warningRef = useRef<HTMLDivElement | null>(null);
  const SCROLL_TOP_OFFSET = 220;
  const [nowTick, setNowTick] = useState(Date.now());
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [groupIdInput, setGroupIdInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [dropdownPeers, setDropdownPeers] = useState<Peer[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const [peerIndex, setPeerIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<PeerEval[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allStatuses, setAllStatuses] = useState<SubmissionStatus[]>([]);
  const [error, setError] = useState<string | string[] | null>(null);
  const [evaluatorId, setEvaluatorId] = useState("");

  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setGroupIdInput(id.toUpperCase());
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const getCountdownState = (date?: string, time?: string, duration?: string) => {
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
  };

  useEffect(() => {
    const id = groupIdInput.trim();
    if (!/^[A-Z0-9]{5}$/.test(id)) { setDropdownPeers([]); setNameInput(""); return; }
    if (USE_MOCK) {
      const raw = localStorage.getItem(`gd_session_${id}`);
      setDropdownPeers(raw ? (JSON.parse(raw) as SessionData).peers : []);
      setNameInput("");
    } else {
      fetch(`/api/gd/${id}`)
        .then(async (r) => {
          const data = await r.json();
          if (!r.ok) {
            throw new Error(data.error || "Session is not available right now.");
          }
          return data;
        })
        .then((data) => {
          const additionalEvaluatorIds = new Set<string>(
            (data.additionalEvaluatorIds || []).map((id: string) => String(id))
          );
          const participants = (data.participants || []).filter(
            (p: { hasSubmitted?: boolean }) => !p.hasSubmitted
          );
          const additionalEvaluators = (data.additionalEvaluators || [])
            .filter((p: { hasSubmitted?: boolean }) => !p.hasSubmitted)
            .map((p: { id: string; name: string; isAdditionalEvaluator?: boolean }) => ({
              id: p.id,
              name: p.name,
              initials: p.name.split(" ").map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 2),
              isAdditionalEvaluator: true,
            }));

          const peers = [
            ...participants.map((p: { id: string; name: string; isAdditionalEvaluator?: boolean }) => ({
              id: p.id,
              name: p.name,
              initials: p.name.split(" ").map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 2),
              isAdditionalEvaluator:
                Boolean(p.isAdditionalEvaluator) || additionalEvaluatorIds.has(String(p.id)),
            })),
            ...additionalEvaluators,
          ];
          setDropdownPeers(peers);
          setNameInput("");
          if (peers.length === 0) {
            setError("All participants have already submitted for this session.");
          } else {
            setError(null);
          }
        })
        .catch((err: any) => {
          setDropdownPeers([]);
          if (id.length === 5) {
            setError(err.message || "Session is not available right now.");
          }
        });
    }
  }, [groupIdInput]);

  const currentPeer    = session?.peers[peerIndex] ?? null;
  const currentEval    = evaluations[peerIndex]    ?? null;
  const submittedCount = allStatuses.filter((s) => s.submitted).length;

  const getMissingFields = (evalItem: PeerEval): string[] => {
    const missing: string[] = [];
    RATING_LABELS.forEach((label, i) => {
      if (evalItem.ratings[i] === 0) missing.push(label);
    });
    if (!evalItem.contribution) missing.push("Contribution Type");
    if (evalItem.teamPlayer === null) missing.push("Team Player");
    if (!evalItem.strength.trim()) missing.push("One-line strength");
    if (!evalItem.improvement.trim()) missing.push("One area to improve");
    return missing;
  };

  const completedCount = evaluations.filter((item) => getMissingFields(item).length === 0).length;

  const updateEval = (update: Partial<PeerEval>) => {
    setError(null);
    setEvaluations((prev) => prev.map((e, i) => (i === peerIndex ? { ...e, ...update } : e)));
  };

  const updateRating = (ri: number, val: number) => {
    if (!currentEval) return;
    const next = [...currentEval.ratings];
    next[ri] = val;
    updateEval({ ratings: next });
  };

  const scrollToCurrentPeerHeader = () => {
    window.requestAnimationFrame(() => {
      const targetTop = peerHeaderRef.current?.getBoundingClientRect().top;
      if (typeof targetTop !== "number") return;
      const absoluteTop = window.scrollY + targetTop;
      window.scrollTo({ top: Math.max(absoluteTop - SCROLL_TOP_OFFSET, 0), behavior: "smooth" });
    });
  };

  const scrollToWarning = () => {
    window.requestAnimationFrame(() => {
      const targetTop = warningRef.current?.getBoundingClientRect().top;
      if (typeof targetTop !== "number") return;
      const absoluteTop = window.scrollY + targetTop;
      window.scrollTo({ top: Math.max(absoluteTop - SCROLL_TOP_OFFSET, 0), behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (step !== 2 || !error) return;
    scrollToWarning();
  }, [error, step]);

  const handleJoin = async () => {
    const id = groupIdInput.trim(), name = nameInput.trim();
    if (!id || !name) return;
    setIsJoining(true); setError(null);
    try {
      let data: SessionData;
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        const raw = localStorage.getItem(`gd_session_${id}`);
        if (!raw) throw new Error("Group ID not found. Check the ID and try again.");
        const full = JSON.parse(raw) as SessionData;
        data = { ...full, peers: full.peers.filter((p) => p.name.trim().toLowerCase() !== name.toLowerCase()) };
        if (data.peers.length === 0) throw new Error("No peers to evaluate. You may be the only participant.");
      } else {
        const res = await fetch(`/api/gd/${id}/join`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: id, participantName: name }),
        });
        const joined = await res.json();
        if (!res.ok || !joined.success) {
          throw new Error(joined.error ?? "Invalid Group ID or session closed.");
        }
        data = {
          groupId: joined.groupId,
          topic: joined.topic,
          peers: joined.peers,
          date: joined.date,
          time: joined.time,
          duration: joined.duration,
        };
        setEvaluatorId(joined.evaluatorId || "");
      }
      setSession(data);
      setEvaluations(data.peers.map((p) => defaultEval(p.id)));
      setStep(2);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally { setIsJoining(false); }
  };

  const handleSaveNext = async () => {
    if (!session || !currentEval) return;
    setError(null);
    if (peerIndex < session.peers.length - 1) {
      setPeerIndex((i) => i + 1);
      scrollToCurrentPeerHeader();
      return;
    }

    const firstPendingIndex = evaluations.findIndex((item) => getMissingFields(item).length > 0);
    if (firstPendingIndex >= 0) {
      setPeerIndex(firstPendingIndex);
      scrollToCurrentPeerHeader();
    }
  };

  const handleSubmitAll = async () => {
    if (!session) return;

    const missingByPeer = evaluations
      .map((evalItem, index) => ({
        peerName: session.peers[index]?.name || `Peer ${index + 1}`,
        missing: getMissingFields(evalItem),
      }))
      .filter((item) => item.missing.length > 0)
      .map((item) => `${item.peerName}: ${item.missing.join(", ")}`);

    if (missingByPeer.length > 0) {
      setError(missingByPeer);
      scrollToWarning();
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      let statuses: SubmissionStatus[];
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
        const raw = localStorage.getItem(`gd_session_${session.groupId}`);
        const full: SessionData = raw ? JSON.parse(raw) : session;
        statuses = full.peers.map((p) => ({ name: p.name, submitted: p.name.trim().toLowerCase() === nameInput.trim().toLowerCase() }));
        if (!statuses.find((s) => s.name.trim().toLowerCase() === nameInput.trim().toLowerCase()))
          statuses = [{ name: nameInput.trim(), submitted: true }, ...statuses];
      } else {
        if (!evaluatorId) {
          throw new Error("Unable to identify evaluator. Please rejoin the session.");
        }
        const res = await fetch(`/api/gd/${session.groupId}/submit`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ evaluatorId, evaluations }),
        });
        const submitData = await res.json();
        if (!res.ok || !submitData.success) throw new Error(submitData.error || "Submission failed. Please try again.");
        statuses = submitData.allStatuses;
      }
      setAllStatuses(statuses);
      setStep(3);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      scrollToWarning();
    } finally { setIsSubmitting(false); }
  };

  const handleBack = () => {
    if (peerIndex > 0) {
      setPeerIndex((i) => i - 1);
      setError(null);
      scrollToCurrentPeerHeader();
    }
  };

  return (
    <>
      <div className="background-with-svg" id="top" />
      <Aurora colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]} blend={1} amplitude={1.0} speed={1} />
      <PillNav
        logo="/logo.png" logoAlt="MSC Logo" activeHref="/events"
        baseColor="#0066cc" pillColor="#0066cc" hoveredPillTextColor="#ffffff" pillTextColor="#ffffff"
        items={[
          { label: "Home", href: "/" }, { label: "About us", href: "/#about" },
          { label: "Events", href: "/events" }, { label: "Blogs", href: "/blog" },
          { label: "Sponsors", href: "/sponsors" }, { label: "Team", href: "/team" },
          { label: "Contact us", href: "/contact" }, { label: "FAQ", href: "/#faq" },
        ]}
      />

      <div className="min-h-screen text-white pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <PageHeader badge="Join Session" title="Join GD Evaluation" subtitle="Enter the Group ID shared by your organiser to begin." />
              {error && (
                <div ref={warningRef}>
                  <ErrorBanner message={error} />
                </div>
              )}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Group ID</label>
                  <input
                    value={groupIdInput}
                    onChange={(e) => { setGroupIdInput(e.target.value.toUpperCase()); setError(null); }}
                    placeholder="ABCDE" maxLength={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-mono font-bold text-center text-white tracking-[0.2em] placeholder-gray-600 focus:outline-none focus:border-[#4da6ff]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 tracking-wide">Your Name</label>
                  <NameDropdown
                    peers={dropdownPeers}
                    value={nameInput}
                    onChange={(v) => { setNameInput(v); setError(null); }}
                    disabled={dropdownPeers.length === 0}
                  />
                </div>
                <button
                  onClick={handleJoin}
                  disabled={!groupIdInput.trim() || !nameInput.trim() || isJoining}
                  className="w-full bg-[#4da6ff] hover:bg-[#4da6ff]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isJoining ? <><RefreshCw className="w-4 h-4 animate-spin" />Joining…</> : "Start Evaluation →"}
                </button>
                <p className="text-center text-xs text-gray-500">
                  The session is only active during the GD. You cannot submit after it closes.
                </p>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && session && currentPeer && currentEval && (
            <>
              <PageHeader
                badge={session.groupId}
                title={`Peer ${peerIndex + 1} of ${session.peers.length}`}
                subtitle={`You: ${nameInput}`}
                right={
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-amber-400">{completedCount} / {session.peers.length} completed</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] ${getCountdownState(
                        session.date,
                        session.time,
                        session.duration
                      ).tone}`}
                    >
                      {getCountdownState(session.date, session.time, session.duration).label}
                    </span>
                  </div>
                }
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                {session.peers.map((peer, i) => {
                  const missing = getMissingFields(evaluations[i]).length;
                  const done = missing === 0;
                  return (
                    <button
                      key={peer.id}
                      type="button"
                      onClick={() => { setPeerIndex(i); setError(null); }}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                        i === peerIndex
                          ? "border-[#4da6ff]/60 bg-[#4da6ff]/10"
                          : done
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <p className="text-xs text-white truncate">{peer.name}</p>
                      <p className={`text-[10px] mt-1 ${done ? "text-emerald-400" : "text-gray-400"}`}>
                        {done ? "Marked" : "Pending"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {error && <ErrorBanner message={error} />}

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">

                {/* Peer header */}
                <div ref={peerHeaderRef} className="flex items-center gap-3 p-5 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#4da6ff]/20 border border-[#4da6ff]/30 flex items-center justify-center text-sm font-bold text-[#4da6ff] flex-shrink-0">
                    {currentPeer.initials}
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl text-white font-bold leading-tight">{currentPeer.name}</p>
                    <p className="text-gray-400 text-xs">Peer {peerIndex + 1} of {session.peers.length}</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-8">

                  {/* Section 2: Ratings */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Ratings</p>
                    <div className="space-y-4">
                      {RATING_LABELS.map((label, ri) => (
                        <RatingRow key={label} label={label} value={currentEval.ratings[ri]} onChange={(v) => updateRating(ri, v)} />
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Section 3: Behavior */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Behaviour</p>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2.5">Contribution Type</label>
                        <div className="flex flex-wrap gap-2">
                          {CONTRIBUTION_TYPES.map((type) => (
                            <button key={type} onClick={() => updateEval({ contribution: type })}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-150 ${currentEval.contribution === type ? "bg-[#4da6ff]/15 border-[#4da6ff]/50 text-[#4da6ff]" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2.5">Team Player?</label>
                        <div className="grid grid-cols-2 gap-3">
                          {([true, false] as const).map((val) => (
                            <button key={String(val)} onClick={() => updateEval({ teamPlayer: val })}
                              className={`py-2.5 rounded-xl text-sm border font-medium transition-all duration-150 ${
                                currentEval.teamPlayer === val
                                  ? val ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-red-500/10 border-red-500/40 text-red-400"
                                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
                              {val ? "Yes" : "No"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Section 4: Feedback */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Feedback</p>
                    <div className="space-y-4">
                      {(["strength", "improvement"] as const).map((field) => (
                        <div key={field}>
                          <label className="block text-sm text-gray-300 mb-1.5">
                            {field === "strength" ? "One-line strength" : "One area to improve"}
                          </label>
                          <textarea
                            value={currentEval[field]}
                            onChange={(e) => updateEval({ [field]: e.target.value })}
                            rows={2}
                            placeholder={field === "strength" ? "e.g. Structured arguments with strong examples..." : "e.g. Could allow others more speaking time..."}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4da6ff]/60 transition-colors resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nav footer */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    {session.peers.map((_, i) => (
                      <span key={i} className={`block rounded-full transition-all duration-200 ${i < peerIndex ? "w-2 h-2 bg-emerald-400" : i === peerIndex ? "w-3 h-2 bg-[#4da6ff]" : "w-2 h-2 bg-white/15"}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {peerIndex > 0 && (
                      <button onClick={handleBack} disabled={isSubmitting}
                        className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50">
                        <ChevronLeft className="w-4 h-4" />Back
                      </button>
                    )}
                    <button onClick={handleSaveNext} disabled={isSubmitting}
                      className="flex items-center gap-1.5 bg-[#4da6ff] hover:bg-[#4da6ff]/90 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                      Save & Next <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={handleSubmitAll} disabled={isSubmitting}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-500/90 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmitting ? <><RefreshCw className="w-4 h-4 animate-spin" />Submitting…</> : "Submit All"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <>
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-5">
                  Submitted
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-2">All done!</h1>
                <p className="text-gray-400 text-sm">Your responses have been recorded. The GD locks automatically once everyone submits.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Submission Status</h3>
                  <p className="text-xs text-amber-400">{submittedCount} / {allStatuses.length} submitted</p>
                </div>
                <div className="space-y-2">
                  {allStatuses.map((s) => (
                    <div key={s.name} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#4da6ff]/20 border border-[#4da6ff]/30 flex items-center justify-center text-xs font-bold text-[#4da6ff] flex-shrink-0">
                        {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm text-gray-300 flex-1">{s.name}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-lg border ${s.submitted ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-amber-500/10 border-amber-500/25 text-amber-400"}`}>
                        {s.submitted ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500 mt-5 pt-4 border-t border-white/10">
                  Page refreshes automatically · Results lock after all submit
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
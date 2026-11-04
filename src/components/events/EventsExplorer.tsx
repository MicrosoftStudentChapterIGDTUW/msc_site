"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import EventCard from "./EventCard";
import {
  CATEGORY_META,
  type EventCategory,
  type EventItem,
  type EventMode,
} from "@/data/events/types";

const CATEGORIES: EventCategory[] = ["Competition", "Seminar", "Bootcamp"];
const MODES: EventMode[] = ["Online", "Offline", "Hybrid"];

type Filters = {
  query: string;
  category: EventCategory | "All";
  year: string;
  mode: EventMode | "All";
};

function matches(e: EventItem, f: Filters, ignoreCategory = false) {
  if (!ignoreCategory && f.category !== "All" && e.category !== f.category) return false;
  if (f.year !== "All" && !e.date.startsWith(f.year)) return false;
  if (f.mode !== "All" && e.mode !== f.mode) return false;

  const q = f.query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    e.title,
    e.tagline,
    e.summary,
    e.venue,
    ...(e.speakers?.map((s) => s.name) ?? []),
    ...(e.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/30"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function EventsExplorer({ events }: { events: EventItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filters["category"]>("All");
  const [year, setYear] = useState("All");
  const [mode, setMode] = useState<Filters["mode"]>("All");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filters = useMemo<Filters>(
    () => ({ query, category, year, mode }),
    [query, category, year, mode]
  );

  const years = useMemo(
    () =>
      Array.from(new Set(events.map((e) => e.date.slice(0, 4)))).sort((a, b) =>
        b.localeCompare(a)
      ),
    [events]
  );

  // Counts on the chips ignore the category filter, so they stay useful.
  const counts = useMemo(() => {
    const base = events.filter((e) => matches(e, filters, true));
    return {
      All: base.length,
      Competition: base.filter((e) => e.category === "Competition").length,
      Seminar: base.filter((e) => e.category === "Seminar").length,
      Bootcamp: base.filter((e) => e.category === "Bootcamp").length,
    };
  }, [events, filters]);

  const visible = useMemo(
    () =>
      events
        .filter((e) => matches(e, filters))
        .sort((a, b) =>
          sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
        ),
    [events, filters, sort]
  );

  const groups = CATEGORIES.map((c) => ({
    category: c,
    items: visible.filter((e) => e.category === c),
  })).filter((g) => g.items.length > 0);

  const hasActiveFilters =
    query !== "" || category !== "All" || year !== "All" || mode !== "All";

  const reset = () => {
    setQuery("");
    setCategory("All");
    setYear("All");
    setMode("All");
  };

  const selectClass =
    "rounded-xl border border-white/10 bg-[#0b1530] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-blue-400 [color-scheme:dark]";

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur md:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, speakers or topics (e.g. Google, DRDO, hackathon)"
            aria-label="Search events"
            className="w-full rounded-xl border border-white/10 bg-[#0b1530] py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Chip active={category === "All"} onClick={() => setCategory("All")}>
            All ({counts.All})
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_META[c].plural} ({counts[c]})
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select aria-label="Filter by year" value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
            <option value="All">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select aria-label="Filter by mode" value={mode} onChange={(e) => setMode(e.target.value as Filters["mode"])} className={selectClass}>
            <option value="All">All modes</option>
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select aria-label="Sort events" value={sort} onChange={(e) => setSort(e.target.value as "newest" | "oldest")} className={selectClass}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-blue-400 transition hover:text-blue-300"
            >
              <X className="h-4 w-4" /> Clear filters
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-slate-400">
        Showing {visible.length} of {events.length} events
      </p>

      {/* Results */}
      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-lg font-medium text-slate-200">No events match your filters</p>
          <p className="mt-1 text-sm text-slate-400">Try a different keyword or clear the filters.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.category} className="space-y-6">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
              <span className={`h-9 w-1 rounded-full ${CATEGORY_META[g.category].bar}`} />
              {CATEGORY_META[g.category].plural}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
export type EventCategory = "Competition" | "Seminar" | "Bootcamp";
export type EventMode = "Online" | "Offline" | "Hybrid";

export interface Person {
  name: string;
  role?: string;
}

export interface EventItem {
  slug: string;            // URL: /events/<slug>
  title: string;
  category: EventCategory;
  date: string;            // ISO "YYYY-MM-DD", used for sorting and year filter
  displayDate: string;     // what visitors see
  time?: string;
  mode: EventMode;
  venue: string;
  image: string;
  tagline?: string;
  summary: string;         // short text for the card
  about?: string[];        // paragraphs for the detail page
  highlights?: string[];
  takeaways?: string[];   // "Key takeaways" section
  whoFor?: string[];      // "Who it's for" section
  speakers?: Person[];
  partners?: string[];
  registerUrl?: string;
  tags?: string[];
}

export const CATEGORY_META: Record<
  EventCategory,
  { plural: string; bar: string; badge: string }
> = {
  Competition: {
    plural: "Competitions",
    bar: "bg-emerald-500",
    badge: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
  },
  Seminar: {
    plural: "Seminars",
    bar: "bg-red-500",
    badge: "border-red-400/30 bg-red-500/15 text-red-300",
  },
  Bootcamp: {
    plural: "Bootcamps",
    bar: "bg-fuchsia-500",
    badge: "border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-300",
  },
};
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import type { EventItem } from "@/data/events/types";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1530]/70 shadow-lg shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-500/10">
      <div className="relative h-56 overflow-hidden">
       
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1530] via-[#0c1530]/30 to-transparent" />
        <h3 className="absolute bottom-4 left-5 right-5 text-xl font-semibold text-white md:text-2xl">
          {event.title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 text-sm text-slate-300">
        <p className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-blue-400" />
          {event.displayDate}
        </p>
        {event.time && (
          <p className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-blue-400" />
            {event.time}
          </p>
        )}
        <p className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0 text-blue-400" />
          {event.venue}
        </p>
        <p className="line-clamp-2 text-slate-400">{event.summary}</p>

        <Link
          href={`/events/${event.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-3 font-medium text-blue-400 transition hover:gap-3 hover:text-blue-300"
        >
          Learn More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
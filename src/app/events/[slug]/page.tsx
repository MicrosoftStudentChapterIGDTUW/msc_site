import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Lightbulb,
  MapPin,
  Monitor,
  Users,
} from "lucide-react";
import { allEvents, getEventBySlug, getRelatedEvents } from "@/data/events";
import { CATEGORY_META } from "@/data/events/types";
import EventCard from "@/components/events/EventCard";
import EventPageChrome from "@/components/events/EventPageChrome";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allEvents.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event not found | MSC IGDTUW" };
  return {
    title: `${event.title} | MSC IGDTUW`,
    description: event.summary,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const meta = CATEGORY_META[event.category];
  const related = getRelatedEvents(event);

  const details = [
    { icon: CalendarDays, label: "Date", value: event.displayDate },
    event.time && { icon: Clock, label: "Time", value: event.time },
    { icon: MapPin, label: "Venue", value: event.venue },
    { icon: Monitor, label: "Mode", value: event.mode },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
        <>
    <EventPageChrome />
    <main className="relative min-h-screen pb-24 pt-32 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10">
          
          <img
            src={event.image}
            alt={event.title}
            className="h-72 w-full object-cover sm:h-80 md:h-[26rem]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f2b] via-[#0b0f2b]/55 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${meta.badge}`}
            >
              {event.category}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">{event.title}</h1>
            {event.tagline && (
              <p className="mt-2 text-base text-blue-300 md:text-lg">{event.tagline}</p>
            )}
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
          {/* Main column */}
          <div className="space-y-10">
            <section>
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                <span className={`h-7 w-1 rounded-full ${meta.bar}`} /> About this event
              </h2>
              <div className="space-y-4 leading-relaxed text-slate-300">
                {(event.about?.length ? event.about : [event.summary]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {event.highlights && event.highlights.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                  <span className={`h-7 w-1 rounded-full ${meta.bar}`} /> Highlights
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {event.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {event.takeaways && event.takeaways.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                  <span className={`h-7 w-1 rounded-full ${meta.bar}`} /> Key takeaways
                </h2>
                <ul className="space-y-3">
                  {event.takeaways.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-slate-300">
                      <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-[#4da6ff]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {event.whoFor && event.whoFor.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                  <span className={`h-7 w-1 rounded-full ${meta.bar}`} /> Who it&apos;s for
                </h2>
                <ul className="space-y-3">
                  {event.whoFor.map((w) => (
                    <li key={w} className="flex items-start gap-3 text-slate-300">
                      <Users className="mt-1 h-4 w-4 shrink-0 text-[#4da6ff]" />
                      {w}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {event.speakers && event.speakers.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                  <span className={`h-7 w-1 rounded-full ${meta.bar}`} /> Speakers
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.speakers.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0c1530]/70 p-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-lg font-semibold text-blue-300">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        {s.role && <p className="text-sm text-slate-400">{s.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.partners && event.partners.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-slate-200">In collaboration with</h2>
                <div className="flex flex-wrap gap-2">
                  {event.partners.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#0c1530]/70 p-6 backdrop-blur lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold">Event details</h2>
            <dl className="space-y-4">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
                    <dd className="text-sm text-slate-200">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {event.registerUrl && (
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-2xl font-semibold">More {meta.plural.toLowerCase()}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
    </>
  );
}
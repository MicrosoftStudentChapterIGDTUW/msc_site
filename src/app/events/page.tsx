"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";

import EventsExplorer from "@/components/events/EventsExplorer";
import { allEvents } from "@/data/events";
import type { EventItem } from "@/data/events/types";

export default function EventsPage() {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<number | null>(
    today.getDate()
  );
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDateClick = (day: number, dateEvents: EventItem[]) => {
    setSelectedDate(day);
    if (dateEvents.length > 0) {
      setSelectedEventIds(dateEvents.map((e) => e.slug));
    } else {
      setSelectedEventIds([]);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  // Events whose ISO date (YYYY-MM-DD) matches the given day of the visible month.
  const getEventsForDate = (day: number): EventItem[] => {
    const key = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allEvents.filter((event) => event.date === key);
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
    setSelectedEventIds([]);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
    setSelectedEventIds([]);
  };

  const changeYear = (offset: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1)
    );
  };

  const selectMonth = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
    setSelectedDate(null);
    setSelectedEventIds([]);
  };

  const selectedEvents = allEvents.filter((e) =>
    selectedEventIds.includes(e.slug)
  );

  return (
    <>
      {/* Background SVG */}
      <div className="background-with-svg" id="top"></div>

      {/* Aurora Background */}
      <Aurora
        colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
        blend={1}
        amplitude={1.0}
        speed={1}
      />

      {/* Sticky Navbar */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gray-300 text-lg">
              Explore our workshops, seminars, and competitions
            </p>
          </div>

          {/* Calendar + Event Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

            {/* Calendar - Left Side */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10 text-white min-h-[350px]">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={
                    showMonthPicker ? () => changeYear(-1) : previousMonth
                  }
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
                >
                  <h2 className="text-xl font-bold">
                    {showMonthPicker
                      ? currentDate.getFullYear()
                      : monthName}
                  </h2>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showMonthPicker ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <button
                  onClick={
                    showMonthPicker ? () => changeYear(1) : nextMonth
                  }
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {showMonthPicker ? (
                <div className="grid grid-cols-3 gap-4 h-[280px] content-center">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => selectMonth(index)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
                        currentDate.getMonth() === index
                          ? "bg-[#4da6ff] text-white shadow-lg scale-105"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105"
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div
                      key={i}
                      className="text-center font-semibold text-gray-400 text-xs py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDate(day);
                    const isSelected = selectedDate === day;
                    const todayCell = isToday(day);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day, dayEvents)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-200 ${
                          isSelected
                            ? "bg-[#4da6ff] text-white scale-105 shadow-lg"
                            : dayEvents.length > 0
                            ? "bg-gradient-to-br from-[#5d3b88] to-[#4da6ff] hover:scale-105"
                            : todayCell
                            ? "bg-white/15 ring-2 ring-[#4da6ff] hover:bg-white/20"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            todayCell && !isSelected ? "text-[#4da6ff]" : ""
                          }`}
                        >
                          {day}
                        </span>
                        {dayEvents.length > 0 && !isSelected && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvents.map((_, idx) => (
                              <div
                                key={idx}
                                className="w-1 h-1 bg-white rounded-full"
                              />
                            ))}
                          </div>
                        )}
                        {todayCell && !isSelected && !event && (
                          <div className="w-1 h-1 bg-[#4da6ff] rounded-full mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Event Details - Right Side */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10 overflow-y-auto max-h-[600px] custom-scrollbar">
              {selectedEvents.length > 0 ? (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold mb-4 text-[#4da6ff]">
                    Event Details
                  </h3>
                  {selectedEvents.map((event, index) => (
                    <div
                      key={event.slug}
                      className={index > 0 ? "pt-8 border-t border-white/10" : ""}
                    >
                      <div className="relative overflow-hidden rounded-xl mb-4 flex-shrink-0 bg-black/40">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-80 object-contain"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold">
                          {event.category}
                        </div>
                      </div>

                      <h4 className="text-2xl font-bold mb-4">{event.title}</h4>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                          <Calendar className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                          <span>{event.displayDate}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-3 text-gray-300">
                            <Clock className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                          <span>{event.venue}</span>
                        </div>
                      </div>

                      <Link
                        href={`/events/${event.slug}`}
                        className="inline-flex items-center gap-2 text-[#4da6ff] text-sm font-medium hover:gap-3 transition-all duration-200 hover:text-white"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Calendar className="w-16 h-16 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-lg">
                    Select a date to view event details
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Dates with events are highlighted in color
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* All events: filters + cards (links go to /events/[slug]) */}
          <EventsExplorer events={allEvents} />

        </div>
      </div>
    </>
  );
}
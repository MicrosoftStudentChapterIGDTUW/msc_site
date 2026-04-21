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

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  image: string;
  link: string;
  category: "upcoming" | "seminar" | "competitions" | "bootcamp";
  time?: string;
  description?: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
}

function getEventHref(link: string): string {
  if (!link) return "/events";
  return link.startsWith("/") ? link : `/${link}`;
}

const events: Event[] = [
  {
    id: 7,
    name: "Think-Tank",
    date: "18th April 2026",
    venue: "Online",
    image: "/images/think_tank.jpeg",
    link: "/gd",
    category: "competitions",
  },
  {
    id: 12,
    name: "Mind Matrix",
    date: "18th March 2026",
    venue: "IGDTUW",
    image: "/images/Mind-matrix.png",
    link: "upevent",
    category: "competitions",
  },
  {
    id: 11,
    name: "Ideate-it-Up 2026",
    date: "18th March 2026",
    venue: "IGDTUW",
    image: "/images/Ideate-it-up.png",
    link: "upevent",
    category: "competitions",
    description: "Think. Create. Elevate.",
  },
  {
    id: 10,
    name: "Insider Series 3.0 - Ep 03",
    date: "11th February 2026",
    venue: "Online",
    image: "/images/Insider-series(3).png",
    link: "upevent",
    category: "seminar",
    time: "08:00 PM - 09:00 PM",
    description:
      "Tech Roles Explained: ctc vs in-hand with Radhika Bansal, Software Developer @ Uber.",
  },
  {
    id: 9,
    name: "Insider Series 3.0 - Ep 02",
    date: "10th February 2026",
    venue: "Online",
    image: "/images/Insider-series(2).png",
    link: "upevent",
    category: "seminar",
    time: "09:00 PM - 10:00 PM",
    description: "How to secure a DRDO Intern with Anusha Mahajan, Product @ Fabric.",
  },
  {
    id: 8,
    name: "Insider Series 3.0 - Ep 01",
    date: "9th February 2026",
    venue: "Online",
    image: "/images/Insider-series(1).png",
    link: "upevent",
    category: "seminar",
    time: "08:00 PM - 09:00 PM",
    description:
      "Resume and LinkedIn optimisation with Sripriya Aggarwal, Founder @TechNeeds.",
  },
  {
    id: 6,
    name: "Hack-it-up",
    date: "18th February, 2025",
    venue: "Seminar Hall, IGDTUW",
    image: "/images/HACK-IT-UP-HomePage.jpg",
    link: "hackitup",
    category: "competitions",
    time: "9:00 AM",
  },
  {
    id: 16,
    name: "Insider Series 2.0 - Ep 04",
    date: "18th November 2024",
    venue: "Online",
    image: "/images/Insider-series 2.0 (4).png",
    link: "upevent",
    category: "seminar",
    time: "07:00 PM - 08:00 PM",
    description: "Guide to the FFE Scholarship & Amazon Internship with Tanisha Bansal.",
  },
  {
    id: 15,
    name: "Insider Series 2.0 - Ep 03",
    date: "17th November 2024",
    venue: "Online",
    image: "/images/Insider-series 2.0 (3).png",
    link: "upevent",
    category: "seminar",
    time: "08:00 PM - 09:00 PM",
    description: "Living the Google Dream: The Path to Google STEP with Rishita Makde and Ayushi Arora.",
  },
  {
    id: 14,
    name: "Insider Series 2.0 - Ep 02",
    date: "16th November 2024",
    venue: "Online",
    image: "/images/Insider-series 2.0 (2).png",
    link: "upevent",
    category: "seminar",
    time: "07:00 PM - 08:00 PM",
    description: "Cracking Uber She++ and UberSTAR Internship with Prakriti Rai and Payal Narwal.",
  },
  {
    id: 13,
    name: "Insider Series 2.0 - Ep 01",
    date: "15th November 2024",
    venue: "Online",
    image: "/images/Insider-series 2.0 (1).png",
    link: "upevent",
    category: "seminar",
    time: "07:00 PM - 08:00 PM",
    description: "The Tech Tea: Google WE Scholar Experience with Navya Verma and Devika Jain.",
  },
  {
    id: 1,
    name: "Bootcamp'24",
    date: "July-August, 2024",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947654/bootcamp_modal_cauj6h.jpg",
    link: "bootcamp24",
    category: "bootcamp",
    time: "10:00 AM",
  },
  {
    id: 2,
    name: "Insider Series 3",
    date: "18th August, 2023",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694948714/insider3_o5pmzb.png",
    link: "upevent",
    category: "seminar",
    time: "2:00 PM",
  },
  {
    id: 3,
    name: "Insider Series 2",
    date: "23rd July, 2023",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947655/insider2_pikd3s.jpg",
    link: "upevent",
    category: "seminar",
    time: "3:00 PM",
  },
  {
    id: 4,
    name: "Insider Series 1",
    date: "20th June, 2023",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947655/insider1_v7omv0.jpg",
    link: "upevent",
    category: "seminar",
    time: "11:00 AM",
  },
  {
    id: 5,
    name: "Bootcamp'23",
    date: "5th June, 2023",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947654/bootcamp_modal_cauj6h.jpg",
    link: "bootcamp",
    category: "bootcamp",
    time: "9:00 AM",
  }
];

const calendarEvents: CalendarEvent[] = [
  { id: 7, title: "Think-Tank", date: "April 18, 2026" },
  { id: 1, title: "Bootcamp'24", date: "August 1, 2024" },
  { id: 12, title: "Mind Matrix", date: "March 18, 2026" },
  { id: 11, title: "Ideate-it-Up 2026", date: "March 18, 2026" },
  { id: 10, title: "Insider Series 3.0 (E03)", date: "February 11, 2026" },
  { id: 9, title: "Insider Series 3.0 (E02)", date: "February 10, 2026" },
  { id: 8, title: "Insider Series 3.0 (E01)", date: "February 9, 2026" },
  { id: 6, title: "Hack-it-up", date: "February 18, 2025" },
  { id: 16, title: "Insider Series 2.0 (E04)", date: "November 18, 2024" },
  { id: 15, title: "Insider Series 2.0 (E03)", date: "November 17, 2024" },
  { id: 14, title: "Insider Series 2.0 (E02)", date: "November 16, 2024" },
  { id: 13, title: "Insider Series 2.0 (E01)", date: "November 15, 2024" },
  { id: 2, title: "Insider 3", date: "August 18, 2023" },
  { id: 3, title: "Insider Series 2", date: "July 23, 2023" },
  { id: 4, title: "Insider Series 1", date: "June 20, 2023" },
  { id: 5, title: "Bootcamp Start", date: "June 5, 2023" }
];

export default function EventsPage() {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<number | null>(
    today.getDate()
  );
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
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

  const handleDateClick = (day: number, dateEvents: CalendarEvent[]) => {
    setSelectedDate(day);
    if (dateEvents.length > 0) {
      setSelectedEventIds(dateEvents.map((e) => e.id));
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

  const getEventsForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      return eventDate === dateStr;
    });
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

  const selectedEvents = selectedEventIds.length > 0
    ? events.filter((e) => selectedEventIds.includes(e.id))
    : [];

  const orderedCategories = Array.from(new Set(events.map((e) => e.category)));
  const categorizedEvents = orderedCategories.reduce((acc, category) => {
    acc[category] = events.filter((e) => e.category === category);
    return acc;
  }, {} as Record<string, Event[]>);

  const categoryConfig: Record<string, { title: string; color: string }> = {
    upcoming: { title: "Upcoming Events", color: "from-blue-500 to-cyan-500" },
    competitions: {
      title: "Competitions",
      color: "from-green-500 to-emerald-500",
    },
    seminar: { title: "Seminars", color: "from-orange-500 to-red-500" },
    bootcamp: { title: "Bootcamps", color: "from-purple-500 to-pink-500" },
  };

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
                      key={event.id}
                      className={index > 0 ? "pt-8 border-t border-white/10" : ""}
                    >
                      <div className="relative overflow-hidden rounded-xl mb-4 flex-shrink-0 bg-black/40">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-80 object-contain"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold">
                          {categoryConfig[event.category].title}
                        </div>
                      </div>

                      <h4 className="text-2xl font-bold mb-4">{event.name}</h4>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                          <Calendar className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                          <span>{event.date}</span>
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

          {/* Categorized Events */}
          <div className="space-y-12">
            {(
              Object.keys(categorizedEvents) as Array<
                keyof typeof categorizedEvents
              >
            ).map((category) => {
              const categoryEvents = categorizedEvents[category];
              if (categoryEvents.length === 0) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-1 h-8 rounded-full bg-gradient-to-b ${categoryConfig[category].color}`}
                    />
                    <h2 className="text-3xl font-bold">
                      {categoryConfig[category].title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryEvents.map((event) => (
                      <div
                        key={event.id}
                        className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#4da6ff]/50 flex flex-col"
                      >
                        <div className="relative overflow-hidden h-48">
                          <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f2b]/90 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-xl font-bold text-white">
                              {event.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Calendar className="w-4 h-4 text-[#4da6ff]" />
                              <span>{event.date}</span>
                            </div>
                            {event.time && (
                              <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <Clock className="w-4 h-4 text-[#4da6ff]" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <MapPin className="w-4 h-4 text-[#4da6ff]" />
                              <span>{event.venue}</span>
                            </div>
                          </div>

                          {event.description && (
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                              {event.description}
                            </p>
                          )}

                          <div className="mt-auto">
                            <Link
                              href={getEventHref(event.link)}
                              className="inline-flex items-center gap-2 text-[#4da6ff] text-sm font-medium hover:gap-3 transition-all duration-200 hover:text-white"
                            >
                              Learn More
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
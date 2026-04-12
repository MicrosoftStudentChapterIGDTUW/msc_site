"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Calendar,
  Clock,
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
  category: "upcoming" | "seminar" | "hackathon" | "bootcamp";
  time?: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
}

const events: Event[] = [
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
    id: 6,
    name: "Hack-it-up",
    date: "18th February, 2025",
    venue: "Seminar Hall, IGDTUW",
    image: "/images/HACK-IT-UP-HomePage.jpg",
    link: "hackitup",
    category: "hackathon",
    time: "9:00 AM",
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
  },
];

const calendarEvents: CalendarEvent[] = [
  { id: 4, title: "Insider Series 1", date: "June 20, 2023" },
  { id: 3, title: "Insider Series 2", date: "July 23, 2023" },
  { id: 5, title: "Bootcamp Start", date: "June 5, 2023" },
  { id: 2, title: "Insider 3", date: "August 18, 2023" },
  { id: 6, title: "Hack-it-up", date: "February 18, 2025" },
];

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2023, 5, 1));
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleDateClick = (day: number, event: CalendarEvent | undefined) => {
    setSelectedDate(day);
    if (event) {
      setSelectedEventId(event.id);
    } else {
      setSelectedEventId(null);
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

  const getEventForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return calendarEvents.find((event) => {
      const eventDate = new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      return eventDate === dateStr;
    });
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
    setSelectedEventId(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
    setSelectedEventId(null);
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
    setSelectedEventId(null);
  };

  const selectedEvent = selectedEventId
    ? events.find((e) => e.id === selectedEventId)
    : null;

  const categorizedEvents = {
    upcoming: events.filter((e) => e.category === "upcoming"),
    seminar: events.filter((e) => e.category === "seminar"),
    hackathon: events.filter((e) => e.category === "hackathon"),
    bootcamp: events.filter((e) => e.category === "bootcamp"),
  };

  const categoryConfig = {
    upcoming: { title: "Upcoming Events", color: "from-blue-500 to-cyan-500" },
    seminar: { title: "Seminars", color: "from-orange-500 to-red-500" },
    hackathon: { title: "Hackathons", color: "from-green-500 to-emerald-500" },
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
        {" "}
        {/* Added pt-20 for top padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gray-300 text-lg">
              Explore our workshops, seminars, and hackathons
            </p>
          </div>
          {/* Calendar + Event Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* Calendar - Left Side */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10 text-white min-h-[350px]">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={showMonthPicker ? () => changeYear(-1) : previousMonth}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
                >
                  <h2 className="text-xl font-bold">
                    {showMonthPicker ? currentDate.getFullYear() : monthName}
                  </h2>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${showMonthPicker ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <button
                  onClick={showMonthPicker ? () => changeYear(1) : nextMonth}
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
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${currentDate.getMonth() === index
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
                    const event = getEventForDate(day);
                    const isSelected = selectedDate === day;

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day, event)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-200 ${isSelected
                          ? "bg-[#4da6ff] text-white scale-105 shadow-lg"
                          : event
                            ? "bg-gradient-to-br from-[#5d3b88] to-[#4da6ff] hover:scale-105"
                            : "bg-white/5 hover:bg-white/10"
                          }`}
                      >
                        <span className="font-medium">{day}</span>
                        {event && !isSelected && (
                          <div className="w-1 h-1 bg-white rounded-full mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Event Details - Right Side */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
              {selectedEvent ? (
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl font-bold mb-4 text-[#4da6ff]">
                    Event Details
                  </h3>

                  <div className="relative overflow-hidden rounded-xl mb-4 flex-shrink-0">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold">
                      {categoryConfig[selectedEvent.category].title}
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold mb-4">
                    {selectedEvent.name}
                  </h4>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                      <span>{selectedEvent.date}</span>
                    </div>
                    {selectedEvent.time && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                        <span>{selectedEvent.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-[#4da6ff] flex-shrink-0" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                  </div>


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
                        className="group bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#4da6ff]/50"
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

                        <div className="p-5">
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

"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Settings2, Users } from "lucide-react";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";

export default function GDLandingPage() {
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

      <div className="min-h-screen text-white pt-20 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl lg:text-7xl font-extrabold text-center leading-none tracking-tight mb-4 ">
            <span className="text-white">Group</span>{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #4da6ff 0%, #7c5cfc 100%)",
              }}
            >
              Discussion
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg text-center max-w-[480px] mx-auto mb-14 leading-relaxed">
          Submit structured feedback for your group discussion and evaluate participants based on clarity, contribution, and collaboration.
          </p>

          {/* Portal cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">

            {/* Admin card */}
            <Link
              href="/gd/admin"
              className="group relative bg-[#4da6ff]/5 hover:bg-[#4da6ff]/10 border border-[#4da6ff]/20 hover:border-[#4da6ff]/50 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4da6ff]/10 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#4da6ff]/10 blur-2xl group-hover:bg-[#4da6ff]/20 transition-all duration-500 pointer-events-none" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#4da6ff]/10 border border-[#4da6ff]/20 flex items-center justify-center mb-5">
                  <Settings2 className="w-5 h-5 text-[#4da6ff]" />
                </div>

                <p className="text-xs text-[#4da6ff] font-medium tracking-widest uppercase mb-1">
                  Organiser
                </p>
                <h2 className="text-xl font-bold text-white mb-1">
                  Admin Portal
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Create a group, add participants, generate a session ID.
                </p>

                <div className="flex items-center gap-1.5 text-[#4da6ff] text-sm font-medium">
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>

            {/* Participant card */}
            <Link
              href="/gd/join"
              className="group relative bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>

                <p className="text-xs text-purple-400 font-medium tracking-widest uppercase mb-1">
                  Participant
                </p>
                <h2 className="text-xl font-bold text-white mb-1">
                  Join Evaluation
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Enter your Group ID and evaluate your peers.
                </p>

                <div className="flex items-center gap-1.5 text-purple-400 text-sm font-medium">
                  Join session
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-gray-600 text-xs text-center mt-10">
            Sessions expire automatically after all participants submit ·{" "}
            <span className="text-gray-500">MSC · IGDTUW</span>
          </p>

        </div>
      </div>
    </>
  );
}
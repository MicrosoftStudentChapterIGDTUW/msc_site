"use client";

import React from "react";
import { motion } from "framer-motion";
import PillNav from "@/components/PillNav";
import Aurora from "@/components/Aurora";

export default function SponsorsPage() {
  const sponsors = [
    {
      id: 1,
      name: "Rise In",
      description: "Education initiative supporting student growth.",
      logo: "/images/risein.png",
      glow: "#4F46E5",
    },
    {
      id: 2,
      name: "AlgoPrep",
      description: "Platform for interview & coding preparation.",
      logo: "/images/algoprep.png",
      glow: "#1E88E5",
    },
    {
      id: 3,
      name: "DoraHacks",
      description: "Global hackathon and Web3 builder community.",
      logo: "/images/dorahacks.png",
      glow: "#FF9800",
    },
    {
      id: 4,
      name: "HackerRank",
      description: "World’s leading competitive coding and skill assessment platform.",
      logo: "/images/hackerrank.png",
      glow: "#00EA64",
    },
    {
      id: 5,
      name: "GFG",
      description: "Largest CS learning & interview prep platform.",
      logo: "/images/gfg.png",
      glow: "#2F8D46",
    },
    {
      id: 6,
      name: "InterviewBuddy",
      description: "Mock interviews and technical practice sessions.",
      logo: "/images/interviewbuddy.png",
      glow: "#0096FF",
    },
    {
      id: 7,
      name: "Unstop",
      description: "Platform for competitions, jobs, and student opportunities.",
      logo: "/images/unstop.png",
      glow: "#5C2D91",
    },
    {
      id: 8,
      name: "Eduquest Education",
      description: "Ed-tech platform providing coaching and career guidance.",
      logo: "/images/eduquesteducation.jpeg",
      glow: "#0A74DA",
    },
    {
      id: 9,
      name: "My Certificate",
      description: "Digital certification and credential verification service.",
      logo: "/images/mycertificate.png",
      glow: "#1A73E8",
    },
    {
      id: 10,
      name: "Fueler",
      description: "Portfolio-based opportunity and student upskilling platform.",
      logo: "/images/fueler.svg",
      glow: "#8B5CF6",
    },
    {
      id: 11,
      name: "Certopus Support",
      description: "Certification automation and support system.",
      logo: "/images/certopus.png",
      glow: "#2CD4D9",
    },
    {
      id: 12,
      name: "StockEdge",
      description: "Stock market education, analysis tools and insights.",
      logo: "/images/stockedge.png",
      glow: "#003F88",
    },
    {
      id: 13,
      name: "Banyan Nation",
      description: "Sustainability, plastic recycling and environment partner.",
      logo: "/images/banyannation.png",
      glow: "#4CAF50",
    },
  ];

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden">

      {/* Background SVG */}
      <div className="background-with-svg absolute inset-0 -z-30" />

      {/* Aurora BACKGROUND like homepage */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <Aurora
          colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
          blend={0.9}
          amplitude={0.9}
          speed={1}
        />
      </div>

      {/* NAVBAR */}
      <div className="relative z-40">
        <PillNav
          logo="/logo.png"
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
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 py-32">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold">OUR SPONSORS</h1>
          <p className="text-gray-300 text-lg mt-4">
            Organizations that support innovation and empower IGDTUW students.
          </p>
        </div>

        {/* SPONSORS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
          {sponsors.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="relative bg-white/5 rounded-3xl p-10 w-full max-w-[420px]
                         backdrop-blur-xl transition hover:scale-[1.02] border border-white/10"
            >
              {/* Light Border */}
              <div
                className="absolute inset-0 rounded-3xl p-[2px] opacity-20 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, #7c91ff, #bfcaff, #e7edff)",
                }}
              />

              {/* Logo Box */}
              <div
                className="relative bg-white rounded-2xl p-8 shadow-xl flex justify-center items-center min-h-[180px] mb-6"
                style={{ boxShadow: `0 0 35px ${s.glow}40` }}
              >
                <div
                  className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
                  style={{ background: s.glow }}
                />
                <img src={s.logo} alt={s.name} className="relative max-h-[90px]" />
              </div>

              <h3 className="text-2xl font-semibold mb-2">{s.name}</h3>
              <p className="text-gray-300">{s.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "motion/react";
import "./Sponsors.css";

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
      description:
        "World’s leading competitive coding and skill assessment platform.",
      logo: "/images/hackerrank.png",
      glow: "#00EA64",
    },
    {
      id: 5,
      name: "GFG",
      description:
        "GeeksforGeeks — largest CS learning & interview prep platform.",
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
      description:
        "Platform for competitions, jobs, and student opportunities.",
      logo: "/images/unstop.png",
      glow: "#5C2D91",
    },
    {
      id: 8,
      name: "Eduquest Education",
      description:
        "Ed-tech platform providing coaching and career guidance.",
      logo: "/images/eduquesteducation.jpeg",
      glow: "#0A74DA",
    },
    {
      id: 9,
      name: "My Certificate",
      description:
        "Digital certification and credential verification service.",
      logo: "/images/mycertificate.png",
      glow: "#1A73E8",
    },
    {
      id: 10,
      name: "Fueler",
      description:
        "Portfolio-based opportunity and student upskilling platform.",
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
      description:
        "Sustainability, plastic recycling and environment partner.",
      logo: "/images/banyannation.png",
      glow: "#4CAF50",
    },
  ];

  return (
    <div className="sponsors-page-wrapper">
      <section className="sponsors-header">
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          OUR SPONSORS
        </motion.h1>

        <motion.p
          className="sponsors-subtitle"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Organizations that believe in the vision of MSC and empower IGDTUW
          students through innovation, mentorship, and real-world opportunities.
        </motion.p>
      </section>

      <div className="sponsors-grid">
        {sponsors.map((s) => (
          <motion.div
            key={s.id}
            className="sponsor-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: s.id * 0.03,
              duration: 0.6,
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              e.currentTarget.style.transform = `rotateX(${-(y / 20)}deg) rotateY(${x / 20}deg) scale(1.03)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "rotateX(0deg) rotateY(0deg) scale(1)";
            }}
          >
            <div
              className="floating-wrapper"
              style={{ "--brand-glow": s.glow } as React.CSSProperties}
            >
              <img src={s.logo} alt={s.name} className="sponsor-logo" />
            </div>

            <h3 className="sponsor-name">{s.name}</h3>
            <p className="sponsor-description">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

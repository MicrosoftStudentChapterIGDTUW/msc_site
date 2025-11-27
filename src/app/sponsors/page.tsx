"use client";

import React from "react";
import { motion } from "motion/react";
import "./Sponsors.css";

export default function SponsorsPage() {
  const sponsors = [
    {
      id: 1,
      name: "Rise in",
      description: "Education initiative supporting student growth.",
      logo: "/images/risein.png",
    },
    {
      id: 2,
      name: "AlgoPrep",
      description: "Platform for interview & coding preparation.",
      logo: "/images/algoprep.png",
    },
    {
      id: 3,
      name: "DoraHacks",
      description: "Global hackathon and Web3 builder community.",
      logo: "/images/dorahacks.png",
    },
    {
      id: 4,
      name: "HackerRank",
      description:
        "World’s leading competitive coding and skill assessment platform.",
      logo: "/images/hackerrank.png",
    },
    {
      id: 5,
      name: "GFG",
      description:
        "GeeksforGeeks — largest CS learning & interview prep platform.",
      logo: "/images/gfg.png",
    },
    {
      id: 6,
      name: "InterviewBuddy",
      description: "Mock interviews and technical practice sessions.",
      logo: "/images/interviewbuddy.png",
    },
    {
      id: 7,
      name: "Unstop",
      description:
        "Platform for competitions, jobs, and student opportunities.",
      logo: "/images/unstop.png",
    },
    {
      id: 8,
      name: "Eduquest Education",
      description:
        "Ed-tech platform providing coaching and career guidance.",
      logo: "/images/eduquesteducation.jpeg",
    },
    {
      id: 9,
      name: "My Certificate",
      description:
        "Digital certification and credential verification service.",
      logo: "/images/mycertificate.png",
    },
    {
      id: 10,
      name: "Fueler",
      description:
        "Portfolio-based opportunity and student upskilling platform.",
      logo: "/images/fueler.svg",
    },
    {
      id: 11,
      name: "Certopus Support",
      description: "Certification automation and support system.",
      logo: "/images/certopus.png",
    },
    {
      id: 12,
      name: "StockEdge",
      description:
        "Stock market education, analysis tools and insights.",
      logo: "/images/stockedge.png",
    },
    {
      id: 13,
      name: "Banyan Nation",
      description:
        "Sustainability, plastic recycling and environment partner.",
      logo: "/images/banyannation.png",
    },
  ];

  return (
    <div className="sponsors-page-wrapper">
      {/* HEADER */}
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

      {/* CARDS */}
      <div className="sponsors-grid">
        {sponsors.map((s) => (
          <motion.div
            key={s.id}
            className="sponsor-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
          >
            <div className="floating-wrapper">
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

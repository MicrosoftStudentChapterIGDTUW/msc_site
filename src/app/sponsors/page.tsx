"use client";

import React from "react";
import { motion } from "motion/react";
import "./Sponsors.css";

export default function SponsorsPage() {
  const sponsors = [
    {
      id: 1,
      name: "Sponsor Name 1",
      description:
        "A proud collaborator supporting innovation, technical excellence, and student growth.",
      logo: "/images/sponsor1.png",
    },
    {
      id: 2,
      name: "Sponsor Name 2",
      description:
        "Partnering with MSC to empower students through events, projects, and opportunities.",
      logo: "/images/sponsor2.png",
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
          Organizations that believe in the vision of MSC and empower IGDTUW students
          through innovation, mentorship, and real-world opportunities.
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

"use client";

import React from "react";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";
import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/blogs";

export default function BlogPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">

      <div className="background-with-svg absolute inset-0 -z-30" />

      {/* Aurora wrapper */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <Aurora
          colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
          blend={0.9}
          amplitude={0.9}
          speed={1}
        />
      </div>

      <div className="relative z-40">
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
        />
      </div>

      <div className="relative z-20 max-w-[1400px] mx-auto px-6 py-32">

        <h1 className="text-5xl font-extrabold text-center mb-16">BLOGS</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
              className="bg-white/5 p-6 rounded-3xl backdrop-blur-lg hover:scale-[1.03] border border-white/10 transition"
            >
              <Link href={`/blog/${post.slug}`}>
                <img
                  src={post.cover}
                  className="rounded-2xl w-full h-56 object-cover"
                />
                <h2 className="text-2xl font-semibold mt-4">{post.title}</h2>
                <p className="text-gray-300 mt-2">{post.excerpt}</p>
                <p className="text-sm text-gray-400 mt-3">{post.date}</p>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

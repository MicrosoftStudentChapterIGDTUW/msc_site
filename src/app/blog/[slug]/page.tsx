"use client";

import React from "react";
import { notFound } from "next/navigation";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";
import { blogPosts } from "@/lib/blogs";
import { motion } from "framer-motion";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden">

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

      <div className="relative z-20 max-w-3xl mx-auto px-6 py-32">

        <img
          src={post.cover}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded-3xl mb-10"
        />

        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {post.title}
        </motion.h1>

        <p className="text-gray-400 mb-10">{post.date}</p>

        <div
          className="prose prose-invert text-gray-200"
          dangerouslySetInnerHTML={{
            __html: post.content.replace(/\n/g, "<br/>"),
          }}
        />
      </div>
    </div>
  );
}

import React from "react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";
import { blogPosts } from "@/lib/blogs";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <div className="relative min-h-screen w-full text-white overflow-hidden">

      {/* Background */}
      <div className="background-with-svg absolute inset-0 -z-30" />

      {/* Aurora */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <Aurora
          colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
          blend={0.9}
          amplitude={0.9}
          speed={1}
        />
      </div>

      {/* Navbar */}
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

      {/* Content */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 py-32">

        {/* Cover */}
        <img
          src={post.cover}
          alt={post.title}
          className="w-full max-h-[400px] object-cover rounded-3xl mb-10"
        />

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">
          {post.title}
        </h1>

        {/* Date */}
        <p className="text-gray-400 mb-10">{post.date}</p>

        {/* ✅ FINAL FIX APPLIED HERE */}
        <div
          className="
            prose 
            prose-invert 
            prose-lg
            max-w-none 
            text-gray-200

            prose-p:mb-6
            prose-p:leading-7

            prose-headings:mt-8
            prose-headings:mb-4

            prose-img:my-8
          "
        >
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>

      </div>
    </div>
  );
}
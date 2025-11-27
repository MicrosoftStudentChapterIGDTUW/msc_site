import React from "react";
import { getPostBySlug, getAllPosts } from "@/lib/blogs";
import Link from "next/link";
import { notFound } from "next/navigation";
// Importing YOUR existing components
import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";

import "../../../globals.css";
import "../../blog.css";

// Define the params interface
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// 1. Generate Static Params for all posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. Generate Metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const post = getPostBySlug(params.slug);
    return {
      title: `${post.title} – MSC Blog`,
      description: post.excerpt,
      keywords: post.keywords.join(", "),
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

// 3. Main Page Component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post;
  
  try {
    post = getPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <>
      {/* Fixed Background Layer */}
      <div className="fixed-bg-layer">
        <Aurora
          colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
          blend={1}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Navbar */}
      <PillNav
        logo="/logo.png"
        logoAlt="MSC Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/#about" },
          { label: "Events", href: "/#events" },
          { label: "Blogs", href: "/blog" },
          { label: "Team", href: "/#team" },
          { label: "Contact us", href: "/#contact" },
          { label: "FAQ", href: "/#faq" },
        ]}
        activeHref="/blog"
      />

      {/* Content */}
      <div className="single-blog-page">
        <Link href="/blog" className="back-btn">
          ← Back to All Blogs
        </Link>

        <h1 className="single-blog-title">{post.title}</h1>
        
        <div className="single-blog-meta">
          <span className="single-blog-category">{post.category}</span>
          <span className="single-blog-date">{post.date}</span>
          <span className="single-blog-reading-time">{post.readingTime}</span>
        </div>
        
        {post.cover && (
          <div className="single-blog-cover">
            <img 
              src={post.cover} 
              alt={post.title} 
              style={{width: '100%', borderRadius: '12px', marginTop: '1rem'}} 
            />
          </div>
        )}

        <article
          className="single-blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="single-blog-footer">
          <Link href="/blog" className="back-btn">
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </>
  );
}
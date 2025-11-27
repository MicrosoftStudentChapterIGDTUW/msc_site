"use client";

import React from "react";
import { blogs } from "../page";
import Link from "next/link";
import "../../blog/blog.css";

export default function BlogPost({ params }: any) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return <h1>Blog Not Found</h1>;

  return (
    <div className="single-blog-page">
      <Link href="/blog" className="back-btn">← Back to Blogs</Link>

      <h1 className="single-blog-title">{blog.title}</h1>
      <p className="single-blog-keywords">{blog.keywords.join(" • ")}</p>

      <p className="single-blog-content">{blog.content}</p>
    </div>
  );
}

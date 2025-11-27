"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./blog.css";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-text">Loading blogs...</p>;

  return (
    <div className="blog-page">
      <h1 className="blog-heading">MSC Blogs</h1>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="blog-card">
            <h2>{blog.title}</h2>
            <p className="blog-keywords">{blog.keywords.join(" • ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../../blog/blog.css";

export default function BlogPost({ params }: any) {
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        const found = data.blogs.find((b: any) => b.slug === params.slug);
        setBlog(found);
      });
  }, [params.slug]);

  if (!blog)
    return (
      <div className="single-blog-page">
        <h1>Blog Not Found</h1>
        <Link href="/blog" className="back-btn">
          ← Back to Blogs
        </Link>
      </div>
    );

  return (
    <div className="single-blog-page">
      <Link href="/blog" className="back-btn">
        ← Back to Blogs
      </Link>

      <h1 className="single-blog-title">{blog.title}</h1>

      <p className="single-blog-keywords">{blog.keywords.join(" • ")}</p>

      <p className="single-blog-content">{blog.content}</p>
    </div>
  );
}

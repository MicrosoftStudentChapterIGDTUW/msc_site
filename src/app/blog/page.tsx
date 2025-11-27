// src/app/blog/page.tsx
import React from "react";
import BlogListClient from "./BlogListClient";
import { getAllPosts } from "@/lib/blogs";
import "./blog.css";

export const metadata = {
  title: "MSC Blog",
  description: "MSC — blogs on tech, events, learning and careers",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="blog-page">
      <h1 className="blog-heading">MSC Blog</h1>
      {/* BlogListClient is a client component that adds search, pagination, filtering */}
      <BlogListClient initialPosts={posts} />
    </div>
  );
}

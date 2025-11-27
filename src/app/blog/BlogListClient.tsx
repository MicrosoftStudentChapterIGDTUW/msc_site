"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/blogs";

type Props = {
  posts: Post[];
};

const PER_PAGE = 6;

export default function BlogListClient({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Collect unique categories
  const categories = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => s.add(p.category));
    return Array.from(s);
  }, [posts]);

  // Search + Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts;

    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.keywords.join(" ").toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    return list;
  }, [posts, query, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Search + categories */}
      <div className="blog-controls">
        <input
          className="search-box"
          placeholder="Search by title, keywords..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <div className="category-chips">
          <button
            className={`chip ${activeCategory === null ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(null);
              setPage(1);
            }}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${activeCategory === c ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(c);
                setPage(1);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Blog cards */}
      <div className="blog-grid">
        {pagePosts.map((p) => (
          <Link href={`/blog/${p.slug}`} key={p.slug} className="blog-card">
            <div className="blog-card-inner">
              {p.cover && <img src={p.cover} className="card-cover" />}

              <h3>{p.title}</h3>

              <div className="meta">
                {p.date} • {p.readingTime}
              </div>

              <p className="blog-keywords">{p.keywords.join(" • ")}</p>

              <p className="excerpt">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// src/app/blog/page.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { loadBlogs, Blog } from "./data";
import "./blog.css";

const PER_PAGE = 6;

function readTime(text: string) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function BlogIndex() {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const loaded = loadBlogs();
    setAllBlogs(loaded);
  }, []);

  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("msc_theme");
    if (stored === "light") setTheme("light");
  }, []);

  useEffect(() => {
    document.documentElement.style.background = theme === "light" ? "#f7f9ff" : "#07102a";
    localStorage.setItem("msc_theme", theme);
  }, [theme]);

  // unique tags
  const tags = useMemo(() => {
    const s = new Set<string>();
    allBlogs.forEach((b) => b.tags.forEach((t) => s.add(t)));
    return [...s];
  }, [allBlogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allBlogs;
    if (activeTag) list = list.filter((b) => b.tags.includes(activeTag));
    if (q.length) {
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.keywords.join(" ").toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allBlogs, query, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageBlogs = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const popular = [...allBlogs]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 5);

  const recent = [...allBlogs].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "")).slice(0, 5);

  return (
    <div className="blog-page">
      <h1 className="blog-heading">MSC Blog</h1>

      <div className="blog-controls">
        <input
          className="search-box"
          placeholder="Search by title, content or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="tag-chips">
          <div
            className={`tag-chip ${activeTag === null ? "active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </div>
          {tags.map((t) => (
            <div
              key={t}
              className={`tag-chip ${activeTag === t ? "active" : ""}`}
              onClick={() => setActiveTag((cur) => (cur === t ? null : t))}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div className="theme-toggle" onClick={() => setTheme((x) => (x === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "Light" : "Dark"}
          </div>
          <Link href="/blog/admin" className="page-btn">Admin</Link>
        </div>
      </div>

      <div className="blog-grid">
        <div>
          <div className="blog-list">
            {pageBlogs.map((b) => (
              <Link href={`/blog/${b.slug}`} key={b.slug} className="blog-card">
                <img src={b.cover || "/images/blog-fallback.png"} alt={b.title} className="cover" />
                <div>
                  <h2>{b.title}</h2>
                  <div className="meta">{b.publishedAt} • {readTime(b.content)}</div>
                  <p className="blog-keywords">{b.keywords.join(" • ")}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className="page-btn"
                onClick={() => setPage(i + 1)}
                style={{ opacity: page === i + 1 ? 1 : 0.7 }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <aside className="blog-sidebar">
          <div className="sidebar-section">
            <h4>Popular</h4>
            {popular.map((p) => (
              <div key={p.slug} className="popular-item">
                <img src={p.cover || "/images/blog-fallback.png"} width={56} height={40} style={{ borderRadius: 8, objectFit: "cover" }} />
                <div>
                  <Link href={`/blog/${p.slug}`} style={{ color: "white", textDecoration: "none" }}>{p.title}</Link>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.publishedAt}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.02)", margin: "1rem 0" }} />

          <div className="sidebar-section">
            <h4>Recent</h4>
            {recent.map((r) => (
              <div key={r.slug} style={{ padding: "0.4rem 0" }}>
                <Link href={`/blog/${r.slug}`} style={{ color: "white", textDecoration: "none" }}>{r.title}</Link>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.publishedAt}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.02)", margin: "1rem 0" }} />

          <div className="sidebar-section">
            <h4>Newsletter</h4>
            <div className="newsletter">
              <input placeholder="you@domain.com" />
              <button className="page-btn" onClick={() => alert("Subscribed (demo)")}>Subscribe</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

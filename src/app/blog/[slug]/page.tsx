// src/app/blog/[slug]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadBlogs, Blog } from "../data";
import "../../blog/blog.css";

function readTime(text: string) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function BlogPost({ params }: any) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    setBlogs(loadBlogs());
  }, []);

  const blog = blogs.find((b) => b.slug === params.slug);
  if (!blog) return <div style={{padding: 48}}>Loading or not found</div>;

  // simple "TOC" by splitting content paragraphs starting lines with uppercase words: we will just create sample sections
  const paragraphs = blog.content.split(/\n\s*\n/).filter(Boolean);

  // related posts by shared tags/keywords
  const related = blogs.filter((b) => b.slug !== blog.slug && b.tags.some((t) => blog.tags.includes(t))).slice(0,3);

  // share links
  const url = (typeof window !== "undefined") ? window.location.href : `https://yourdomain.com/blog/${blog.slug}`;
  const share = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(blog.title + " " + url)}`
  };

  // animated reveal: we use simple state to stagger paragraphs
  const [visibleCount, setVisibleCount] = useState(1);
  useEffect(() => {
    let i = 1;
    const t = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i > paragraphs.length + 1) clearInterval(t);
    }, 180);
    return () => clearInterval(t);
  }, [blog.slug]);

  return (
    <div className="single-blog-page">
      <Link href="/blog" className="back-btn">← Back to Blogs</Link>
      <h1 className="single-blog-title">{blog.title}</h1>
      <div className="single-blog-keywords">{blog.keywords.join(" • ")} • {readTime(blog.content)}</div>

      {blog.cover && <img src={blog.cover} alt={blog.title} className="single-blog-cover" />}

      {/* TOC */}
      <div style={{display: "flex", gap: 24, alignItems: "flex-start"}}>
        <div style={{flex: 1}}>
          <div className="single-blog-content">
            {paragraphs.map((p, idx) => (
              <div
                key={idx}
                style={{
                  opacity: idx < visibleCount ? 1 : 0,
                  transform: idx < visibleCount ? "translateY(0px)" : "translateY(8px)",
                  transition: "all 320ms ease",
                  marginBottom: 18
                }}
                dangerouslySetInnerHTML={{__html: `<p>${p.replace(/\n/g,"<br/>")}</p>`}}
              />
            ))}
          </div>

          {/* share */}
          <div className="share-row">
            <a className="share-btn" href={share.twitter} target="_blank">Twitter</a>
            <a className="share-btn" href={share.linkedin} target="_blank">LinkedIn</a>
            <a className="share-btn" href={share.whatsapp} target="_blank">WhatsApp</a>
            <button className="share-btn" onClick={() => { navigator.clipboard?.writeText(url); alert("Link copied"); }}>Copy link</button>
          </div>

          {/* related */}
          <div style={{marginTop: 28}}>
            <h3>You may also like</h3>
            <div className="related-grid">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="blog-card">
                  <img src={r.cover || "/images/blog-fallback.png"} alt={r.title} style={{height: 110, width: "100%", objectFit: "cover", borderRadius: 8}} />
                  <div style={{padding: "0.6rem 0"}}>
                    <strong>{r.title}</strong>
                    <div style={{fontSize: 13, color: "var(--muted)"}}>{r.publishedAt}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside style={{width: 240}}>
          <div className="toc">
            <h4>On this page</h4>
            {paragraphs.slice(0,5).map((p, i) => (
              <a key={i} href={"#p" + i} style={{display:"block", color: "var(--muted)", margin: "6px 0"}}>{p.slice(0,50)}...</a>
            ))}
          </div>

          <div style={{height: 12}}></div>

          <div className="sidebar-section">
            <h4>Subscribe</h4>
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

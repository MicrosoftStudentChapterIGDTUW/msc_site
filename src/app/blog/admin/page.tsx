// src/app/blog/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { initialBlogs, loadBlogs } from "../data";

export default function BlogAdmin() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    setBlogs(loadBlogs());
  }, []);

  const login = () => {
    if (pw === "msc-admin") {
      setAuth(true);
    } else alert("Wrong password (demo)");
  };

  const saveAll = (arr: any[]) => {
    localStorage.setItem("msc_blogs", JSON.stringify(arr));
    setBlogs(arr);
    alert("Saved (localStorage)");
  };

  const addNew = () => {
    const blank = {
      slug: "new-post-" + Date.now(),
      title: "Untitled",
      keywords: [],
      tags: [],
      description: "",
      content: "Write content here...",
      cover: "/images/blog-fallback.png",
      publishedAt: new Date().toISOString().slice(0,10)
    };
    const next = [blank, ...blogs];
    saveAll(next);
  };

  const del = (slug: string) => {
    const next = blogs.filter(b => b.slug !== slug);
    saveAll(next);
  };

  const startEdit = (b: any) => setEditing({ ...b });
  const cancelEdit = () => setEditing(null);

  const commitEdit = () => {
    const next = blogs.map(b => b.slug === editing.slug ? editing : b);
    saveAll(next);
    setEditing(null);
  };

  if (!auth) {
    return (
      <div style={{padding: 40}}>
        <Link href="/blog">← Back</Link>
        <h2>Admin (demo)</h2>
        <input placeholder="password" value={pw} onChange={e => setPw(e.target.value)} />
        <button onClick={login}>Login</button>
        <p>demo password: <code>msc-admin</code></p>
      </div>
    );
  }

  return (
    <div style={{padding: 32}}>
      <Link href="/blog">← Back</Link>
      <h2>Blog Admin</h2>
      <div style={{display: "flex", gap: 12, marginBottom: 12}}>
        <button onClick={addNew}>Add new</button>
        <button onClick={() => saveAll(initialBlogs)}>Reset to defaults</button>
      </div>

      <div style={{display:"grid", gap:8}}>
        {blogs.map(b => (
          <div key={b.slug} style={{padding:12, border: "1px solid #333", borderRadius: 8}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <div>
                <strong>{b.title}</strong> <div style={{fontSize:12}}>{b.slug}</div>
              </div>
              <div style={{display:"flex", gap:8}}>
                <button onClick={() => startEdit(b)}>Edit</button>
                <button onClick={() => del(b.slug)}>Delete</button>
                <Link href={`/blog/${b.slug}`}><button>Open</button></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{marginTop: 20, padding: 12, border: "1px solid #555"}}>
          <h3>Editing {editing.slug}</h3>
          <div style={{display:"grid", gap:8}}>
            <input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} />
            <input value={editing.slug} onChange={e => setEditing({...editing, slug: e.target.value})} />
            <input value={editing.cover} onChange={e => setEditing({...editing, cover: e.target.value})} />
            <input value={editing.publishedAt} onChange={e => setEditing({...editing, publishedAt: e.target.value})} />
            <input value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} />
            <textarea rows={10} value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} />
            <div style={{display:"flex", gap:8}}>
              <button onClick={commitEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

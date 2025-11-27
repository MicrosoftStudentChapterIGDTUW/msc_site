// src/lib/blogs.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  keywords: string[];
  category: string;
  date: string;
  excerpt: string;
  cover?: string | null;
  readingTime: string;
  content: string; // HTML for detail page; empty string in list
};

const postsDirectory = path.join(process.cwd(), "src", "content", "blogs");

function getReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: (data.title as string) || "Untitled Post",
      keywords: (data.keywords as any[]) || [],
      category: (data.category as string) || "General",
      date: (data.date as string) || "Unknown",
      excerpt: (data.excerpt as string) || (content.slice(0, 160) + "..."),
      cover: (data.cover as string) || null,
      readingTime: getReadingTime(content),
      // keep content empty for list view (detail page will load full HTML)
      content: "",
    } as Post;
  });

  // Optionally sort by date (desc) if dates are present, else by slug
  posts.sort((a, b) => {
    if (a.date && b.date && a.date !== "Unknown" && b.date !== "Unknown") {
      return b.date.localeCompare(a.date);
    }
    return a.slug.localeCompare(b.slug);
  });

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const html = marked.parse(content);

  return {
    slug,
    title: (data.title as string) || "Untitled Post",
    keywords: (data.keywords as any[]) || [],
    category: (data.category as string) || "General",
    date: (data.date as string) || "Unknown",
    excerpt: (data.excerpt as string) || (content.slice(0, 160) + "..."),
    cover: (data.cover as string) || null,
    readingTime: getReadingTime(content),
    content,
  } as Post;
}

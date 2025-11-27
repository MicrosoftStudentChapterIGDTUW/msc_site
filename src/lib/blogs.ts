import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export type Post = {
  slug: string;
  title: string;
  keywords: string[];
  category: string;
  date: string;
  excerpt: string;
  cover?: string;
  readingTime: string;
  content: string;
};

// Use process.cwd() for Vercel compatibility
const postsDirectory = path.join(process.cwd(), "posts");

marked.setOptions({
  gfm: true,
  breaks: true,
});

function getReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export function getAllPosts(): Post[] {
  // Safety check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.error("Directory not found:", postsDirectory);
    return [];
  }

  const files = fs.readdirSync(postsDirectory);

  return files
    .filter((fn) => fn.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(".md", "");
      const fullPath = path.join(postsDirectory, file);
      const raw = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title || "Untitled Post",
        keywords: data.keywords || [],
        category: data.category || "General",
        date: data.date || "",
        excerpt: data.excerpt || content.slice(0, 160) + "...",
        cover: data.cover || "",
        readingTime: getReadingTime(content),
        content: "",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }
  
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const rawHtml = marked(content) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return {
    slug,
    title: data.title || "Untitled Post",
    keywords: data.keywords || [],
    category: data.category || "General",
    date: data.date || "",
    excerpt: data.excerpt || content.slice(0, 160) + "...",
    cover: data.cover || "",
    readingTime: getReadingTime(content),
    content: cleanHtml,
  };
}
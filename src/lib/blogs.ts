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
  cover?: string;
  readingTime: string;
  content: string;
};

const postsDirectory = path.join(process.cwd(), "src/content/blogs");

// Utility to estimate reading time
function getReadingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled Post",
      keywords: data.keywords || [],
      category: data.category || "General",
      date: data.date || "Unknown",
      excerpt: data.excerpt || content.substring(0, 160) + "...",
      cover: data.cover || null,
      readingTime: getReadingTime(content),
    };
  });
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "Untitled Post",
    keywords: data.keywords || [],
    category: data.category || "General",
    date: data.date || "Unknown",
    excerpt: data.excerpt || content.substring(0, 160) + "...",
    cover: data.cover || null,
    readingTime: getReadingTime(content),
    content: marked(content),
  };
}

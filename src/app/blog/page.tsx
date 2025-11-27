import { getAllPosts } from "@/lib/blogs";
import BlogListClient from "./BlogListClient";
import "./blog.css";

export const metadata = {
  title: "Blogs | MSC",
};

export default async function BlogPage() {
  const posts = await getAllPosts(); // <-- FIXED

  return (
    <div className="blog-page">
      <h1 className="blog-heading">MSC Blogs</h1>
      <BlogListClient posts={posts} />
    </div>
  );
}

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  content: string;
  date: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-coding",
    title: "How to Start Coding – A Roadmap for Beginners",
    excerpt:
      "A beginner-friendly roadmap to start your tech journey with clarity and confidence.",
    cover: "/blog/coding.png",
    date: "2024-01-12",
    content: `
### Introduction

Learning to code is one of the most rewarding journeys…

### Step 1 — Pick One Language  
Start with Python or JavaScript…

### Step 2 — Build Projects  
Small projects teach more than theory…

### Step 3 — Stay Consistent  
1 hour daily beats 8 hours once a week…

### Conclusion  
Consistency and curiosity are your most important tools.
    `,
  },

  {
    slug: "why-girls-should-learn-tech",
    title: "Why Girls Should Learn Tech in 2025",
    excerpt: "Tech is the future — and women are shaping it in powerful ways.",
    cover: "/blog/women-tech.png",
    date: "2024-02-10",
    content: `
### Women in Tech 2025  
The number of women entering technology has doubled…

### Opportunities  
From AI to cybersecurity…

### Final Words  
This is your time. Step into tech confidently.
    `,
  },
];

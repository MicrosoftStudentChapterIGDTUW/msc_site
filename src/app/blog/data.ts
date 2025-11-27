// src/app/blog/data.ts
export type Blog = {
  slug: string;
  title: string;
  keywords: string[];
  tags: string[];
  content: string; // markdown-like plain text (we render as paragraphs)
  description: string; // short summary (for list/meta)
  cover?: string; // path to cover image in /public/images/
  publishedAt?: string;
  featured?: boolean;
};

export const initialBlogs: Blog[] = [
  {
    slug: "ai-in-education",
    title: "How AI is Transforming Student Learning in 2025",
    keywords: ["AI", "EdTech", "Personalized Learning"],
    tags: ["AI", "EdTech"],
    description:
      "How adaptive AI systems and intelligent tutoring are reshaping how students learn, practice and grow in universities and bootcamps.",
    cover: "/images/blog-ai-in-education.png",
    publishedAt: "2025-03-10",
    content: `Artificial Intelligence has shifted from optional enhancement to a core component of modern education. Personalized learning models allow students to follow study paths aligned to their pace and cognitive strengths. Adaptive platforms analyze performance patterns and build tailored coursework in real time. AI mentorship systems provide round-the-clock support, offering hints, concept explanations and targeted insights. This shift ensures deeper understanding instead of surface-level memorization.

Universities integrate AI-driven analytics to map student progress, forecast outcomes and recommend strategies. With NLP improvements, interactive tutors can communicate nearly as effectively as human mentors. Proper ethical guidelines are vital, but the potential is huge. The future of learning is student-centric, skill-driven, and powered by intelligent systems.`,
  },

  {
    slug: "future-of-hackathons",
    title: "Why Hackathons Are Becoming the Future of Hiring",
    keywords: ["Hackathons", "Hiring", "Careers"],
    tags: ["Careers", "Events"],
    description:
      "Why companies and students treat hackathon performance as a real measure of practical skill and team collaboration.",
    cover: "/images/blog-future-of-hackathons.png",
    publishedAt: "2025-02-28",
    content: `Hackathons have evolved far beyond coding competitions. They now function as efficient talent-identification systems. Companies observe how participants solve problems, collaborate and prototype under pressure—skills interviews often miss. Students gain hands-on exposure to engineering constraints and rapid prototyping.

Recruiters treat hackathon performance as evidence of practical capability; prototypes often speak louder than resumes. Virtual hackathons expand access and diversity. These events are increasingly central to career development in product and engineering domains.`,
  },

  {
    slug: "women-in-tech",
    title: "The Rising Wave of Women in Tech Leadership",
    keywords: ["Women in Tech", "Leadership", "STEM"],
    tags: ["Diversity", "Leadership"],
    description:
      "A snapshot of the growing representation of women in senior technical and product roles, and how to accelerate the change.",
    cover: "/images/blog-women-in-tech.png",
    publishedAt: "2025-01-20",
    content: `Across the globe, women are stepping into influential technical and strategic roles, driven by targeted education programs, mentorship networks and inclusive hiring. Representation encourages a broader pipeline into engineering, AI and product fields. Women in leadership bring unique perspectives and empathy-driven decision-making that improve team outcomes.

Challenges remain—biases and mentorship gaps—but initiatives are working. Universities and clubs can help by offering mentorship, leadership labs and visibility platforms. Empowering women in tech is both a moral and innovation imperative.`,
  },

  {
    slug: "coding-journey",
    title: "How to Start Your Coding Journey with Zero Experience",
    keywords: ["Coding", "Beginners", "Learning"],
    tags: ["Learning", "Beginners"],
    description:
      "A practical roadmap for absolute beginners: pick a language, build small projects and join communities.",
    cover: "/images/blog-coding-journey.png",
    publishedAt: "2024-12-05",
    content: `Starting from zero is less daunting with today's tools. Pick a beginner-friendly language (Python or JavaScript). Focus on small, consistent practice: 45 minutes daily beats cramming. Build little projects: a todo app, a portfolio site, or automations. Projects teach debugging, design and deployment.

Join communities and coding clubs for accountability and feedback. Use version control (Git) early. Over time, combine projects with data structures and algorithms practice. Curiosity and consistency beat perfectionism.`,
  },

  {
    slug: "mentorship-impact",
    title: "Why Mentorship Matters More Than Ever in 2025",
    keywords: ["Mentorship", "Career", "Growth"],
    tags: ["Mentorship"],
    description:
      "Mentorship massively accelerates growth — here’s how structured guidance helps students succeed faster.",
    cover: "/images/blog-mentorship-impact.png",
    publishedAt: "2025-04-02",
    content: `Mentorship is a top accelerator for career and academic progress. Mentees gain real-world insight, project feedback, and networking. Mentors provide course corrections, portfolio guidance and moral support. Modern platforms connect students to mentors globally, democratizing access to expertise.

A structured mentorship culture reduces burnout, increases goal completion and builds a habit of lifelong learning. Clubs and faculties should prioritise mentorship programs.`,
  },

  {
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness: Why Students Must Pay Attention",
    keywords: ["Cybersecurity", "Privacy", "Safety"],
    tags: ["Security"],
    description:
      "A quick primer on threats students face and practical steps to secure accounts, data and project backups.",
    cover: "/images/blog-cybersecurity-awareness.png",
    publishedAt: "2025-03-01",
    content: `Students are prime targets for phishing, credential theft and social engineering. Protect accounts with strong unique passwords and two-factor authentication. Understand phishing signs and audit sharing permissions in cloud drives. Back up project repositories and use secure channels for sensitive data.

Cybersecurity literacy protects you and your institution. Basic practices reduce risk dramatically.`,
  },

  {
    slug: "project-based-learning",
    title: "Project-Based Learning: The Skill That Gets You Hired",
    keywords: ["Projects", "Portfolio", "Hiring"],
    tags: ["Projects", "Careers"],
    description:
      "Why real projects matter more than perfect grades — how to design a portfolio that tells your story.",
    cover: "/images/blog-project-based-learning.png",
    publishedAt: "2024-11-15",
    content: `Employers value evidence of real work. A vibrant portfolio shows initiative and problem-solving. Choose projects that solve real problems or automate common tasks. Document challenges and decisions. Host the code and demos. Pair each project with a short case study: problem, approach, impact.

Project-based learning encourages end-to-end thinking and creativity — the traits that get you hired.`,
  },

  {
    slug: "tech-community-power",
    title: "The Power of Tech Communities in Student Growth",
    keywords: ["Community", "Clubs", "Events"],
    tags: ["Community"],
    description:
      "Why joining a tech community multiplies learning speed and opens doors to projects, internships and public speaking.",
    cover: "/images/blog-tech-community-power.png",
    publishedAt: "2024-10-05",
    content: `Tech communities catalyse growth. Through shared projects, workshops and events, members learn faster and build networks. Communities teach leadership, event management and communication skills. They also provide mentors and hiring signals. For many students, clubs are the launching pad to internships and meaningful projects.`,
  },

  {
    slug: "time-management-tech",
    title: "Mastering Time Management as a Tech Student",
    keywords: ["Productivity", "Time Management", "Student Life"],
    tags: ["Productivity"],
    description:
      "Time-boxing, priority matrices and healthy routines to stay productive across coursework, projects and life.",
    cover: "/images/blog-time-management-tech.png",
    publishedAt: "2024-09-01",
    content: `Juggling academics and projects needs structure. Use time-boxing and priority matrices. Schedule deep work and breaks. Small repeated habits beat last-minute marathons. Plan weekly goals and review progress. Protect mental health and make room for rest — sustainable productivity is the goal.`,
  },
];

export function loadBlogs(): Blog[] {
  try {
    const raw = typeof window !== "undefined" && localStorage.getItem("msc_blogs");
    if (raw) {
      const parsed = JSON.parse(raw) as Blog[];
      // merge with initial if needed
      return parsed;
    }
  } catch (e) {
    // ignore
  }
  return initialBlogs;
}

"use client";

import React from "react";
import Link from "next/link";
import "./blog.css";

const blogs = [
  {
    slug: "ai-in-education",
    title: "How AI is Transforming Student Learning in 2025",
    keywords: ["AI", "EdTech", "Innovation"],
    content: `Artificial Intelligence has rapidly shifted from optional enhancement to a core component of modern education. In 2025, personalized learning models allow students to follow study paths aligned to their pace, interests, and cognitive strengths. Adaptive platforms analyze performance patterns and build tailored coursework in real time. AI mentorship systems provide round-the-clock support, offering hints, concept explanations, and targeted insights. This shift ensures deeper understanding instead of surface-level memorization. 
    Universities are increasingly integrating AI-driven analytics to map student progress, forecast academic outcomes, and recommend improvement strategies. With advancements in natural language processing, interactive tutors can communicate nearly as effectively as human mentors. Proper ethical guidelines must be established, but the potential is limitless. The future of learning will be student-centric, skill-driven, and powered by intelligent systems.`,
  },
  {
    slug: "future-of-hackathons",
    title: "Why Hackathons Are Becoming the Future of Hiring",
    keywords: ["Hackathons", "Careers", "Tech Hiring"],
    content: `Hackathons have evolved far beyond coding competitions. In 2025, they function as one of the most efficient talent-identification systems worldwide. Companies now observe how participants solve problems, collaborate, communicate, and innovate under pressure—skills that regular interviews cannot capture. Students benefit as well: hackathons expose them to real engineering constraints, rapid prototyping, and teamwork under strict deadlines. 
    Recruiters increasingly treat hackathon performance as a benchmark of practical capability, valuing prototypes more than resumes. Additionally, hackathons foster community, creativity, and long-term peer networks. With virtual formats expanding accessibility, participation is at an all-time high. These events are no longer optional—they are becoming a core element of career development in engineering and product fields.`,
  },
  {
    slug: "women-in-tech",
    title: "The Rising Wave of Women in Tech Leadership",
    keywords: ["Women in Tech", "Leadership", "STEM"],
    content: `Across the globe, women are increasingly stepping into influential technical and strategic roles. This shift is driven by educational programs, inclusive hiring policies, and the emergence of female-led tech communities. Representation encourages more women to pursue engineering, AI, cybersecurity, and product fields. As companies value diversity for innovation, women in leadership bring unique perspectives, empathy-driven decision-making, and strong problem-solving frameworks. 
    Even though challenges persist—such as biases, mentorship gaps, and limited recognition—progress is undeniable. Universities and tech groups play a crucial role by offering mentorship networks, leadership programs, and visibility platforms. Empowering women in technology is not only a moral imperative but also a catalyst for exponential industry innovation.`,
  },
  {
    slug: "coding-journey",
    title: "How to Start Your Coding Journey with Zero Experience",
    keywords: ["Coding", "Learning", "Beginners"],
    content: `Starting a coding journey with absolutely no background may seem overwhelming, but the modern learning ecosystem makes it easier than ever. Beginners should start by choosing one fundamental language—usually Python or JavaScript—due to their clarity and wide industry use. Consistency matters far more than speed; even 45 minutes a day builds exponential long-term mastery. 
    Practical projects accelerate learning: building small apps, designing simple websites, or solving beginner-friendly problems. Communities, bootcamps, and mentorship groups add accountability and direction. Unlike rigid academic learning, coding thrives on experimentation and curiosity. Anyone with patience, practice, and structure can transition from beginner to confident developer.`,
  },
  {
    slug: "mentorship-impact",
    title: "Why Mentorship Matters More Than Ever in 2025",
    keywords: ["Mentorship", "Growth", "Career"],
    content: `Mentorship has become one of the strongest accelerators for academic and career development. Students guided by mentors gain confidence, direction, and practical experience that academic courses alone cannot offer. Mentors help decode complex topics, guide project development, and provide insights into real industry workflows. 
    In 2025, online mentorship platforms have democratized access to experts worldwide. This support system improves motivation and reduces academic burnout. Mentorship creates a cycle of shared learning—each generation enabling the next.`,
  },
  {
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness: Why Students Must Pay Attention",
    keywords: ["Cybersecurity", "Awareness", "Student Safety"],
    content: `With cyber threats rising globally, students are now primary targets of phishing, ransomware, credential theft, and social engineering attacks. The shift to digital learning means personal data, academic accounts, and cloud files are constantly at risk. Awareness is the first defense: identifying suspicious emails, using strong passwords, enabling two-factor authentication, and avoiding risky downloads. 
    Cybersecurity education is becoming essential—not optional—for every department. Students who understand digital safety not only protect themselves but also contribute to secure institutional ecosystems.`,
  },
  {
    slug: "project-based-learning",
    title: "Project-Based Learning: The Skill That Gets You Hired",
    keywords: ["Projects", "Learning", "Hiring"],
    content: `The industry has shifted dramatically from theoretical evaluation to practical verification of skills. Recruiters now prioritize real projects over grades. Whether it is building a web app, training a machine-learning model, or designing UI/UX screens, project-based learning demonstrates initiative, creativity, and hands-on capability. 
    Students who maintain active GitHub profiles or portfolios stand out instantly. Projects reflect problem-solving ability and technical curiosity—traits that employers value most. This shift empowers students to take control of their learning paths.`,
  },
  {
    slug: "tech-community-power",
    title: "The Power of Tech Communities in Student Growth",
    keywords: ["Community", "Teamwork", "Tech Clubs"],
    content: `Tech communities create an environment of shared learning that accelerates growth far beyond individual study. Students collaborate, build projects, participate in events, attend workshops, and gain early exposure to emerging technologies. Communities foster leadership, public speaking, event management, and teamwork—skills essential for career growth. 
    Being part of a community provides motivation, accountability, and lifelong connections. Such ecosystems have produced some of the best developers and innovators of this decade.`,
  },
  {
    slug: "time-management-tech",
    title: "Mastering Time Management as a Tech Student",
    keywords: ["Time Management", "Student Life", "Productivity"],
    content: `Balancing academics, projects, competitions, internships, and personal well-being can feel overwhelming. Mastering time management helps students stay consistent and stress-free. Techniques like time-boxing, digital planners, and priority matrices help sort tasks effectively. Consistency is built through small, repeated actions—not sudden bursts of productivity. 
    Tech students must also schedule breaks, avoid burnout, and maintain a healthy balance between learning and rest. Productivity is not about doing more—it’s about doing what matters.`,
  },
];

export default function BlogPage() {
  return (
    <div className="blog-page">
      <h1 className="blog-heading">MSC Blogs</h1>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="blog-card">
            <h2>{blog.title}</h2>
            <p className="blog-keywords">{blog.keywords.join(" • ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { blogs };

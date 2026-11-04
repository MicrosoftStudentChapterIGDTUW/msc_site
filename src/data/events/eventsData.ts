import type { EventItem } from "./types";

const insiderAbout =
  "Insider Series is MSC IGDTUW's career-focused series where industry insiders share their journeys, lessons and practical advice, so students can make informed decisions about internships, placements and careers.";

const insiderWhoFor = [
  "Students planning internships and placements",
  "Anyone who wants honest, first-hand career advice from people already in the industry",
];

export const eventsData: EventItem[] = [
  // ───────────────────────── Competitions (first 2) ─────────────────────────
  {
    slug: "think-tank",
    title: "Think-Tank",
    category: "Competition",
    date: "2026-04-18",
    displayDate: "18th April 2026",
    mode: "Online",
    venue: "Online",
    image: "/images/think_tank.jpeg",
    tagline: "Challenge ideas. Sharpen communication.",
    summary:
      "An online technical group discussion to challenge ideas and build collaborative thinking.",
    about: [
      "Think-Tank is MSC IGDTUW's online technical group discussion, held on 18th April 2026. It's designed to challenge ideas, sharpen communication and build collaborative thinking, the skills that group-discussion rounds and team projects demand.",
      "Participants were placed in groups, took on technical topics together, and received feedback from both judges and peers.",
    ],
    highlights: [
      "Online technical group discussion",
      "Feedback from judges and peers",
      "Held on 18th April 2026",
    ],
    takeaways: [
      "How to structure and present your argument clearly in a group setting",
      "Listening, building on others' points and disagreeing constructively",
      "Honest feedback on your communication from judges and peers",
    ],
    whoFor: [
      "Students preparing for GD and interview rounds in placements",
      "Anyone who wants to get more confident speaking about technical topics",
    ],
    tags: ["group discussion", "gd", "communication", "online"],
  },
  {
    slug: "mind-matrix",
    title: "Mind Matrix",
    category: "Competition",
    date: "2026-03-18", // VERIFY: same date as Ideate-it-Up on the live site
    displayDate: "18th March 2026",
    mode: "Offline",
    venue: "IGDTUW",
    image: "/images/Mind-matrix.png",
    tagline: "Strategy. Logic. Psychology.",
    summary:
      "A multi-stage strategy showdown of auctions, logic grids and psychological rounds.",
    about: [
      "Mind Matrix 2026 is a multi-stage strategy showdown that tests how participants think, bid and decide under pressure. Its rounds mix auctions, logic grids and psychological challenges.",
      "It was powered by MSC IGDTUW in collaboration with IGTS-DTU, and held in person at IGDTUW.",
    ],
    highlights: [
      "Three stages: Prelims → Advanced → Grand Finals",
      "Rounds of auctions, logic grids and psychological challenges",
      "Powered by MSC IGDTUW × IGTS-DTU",
    ],
    takeaways: [
      "Practice in strategic thinking and decision-making under time pressure",
      "Logical reasoning skills that carry over to aptitude and technical rounds",
      "Experience competing and collaborating across stages of a multi-round event",
    ],
    whoFor: [
      "Students who enjoy puzzles, strategy and competitive thinking",
      "Participants from any branch, as no coding is required",
    ],
    partners: ["IGTS-DTU"],
    tags: ["strategy", "logic", "auction", "puzzle"],
  },

  // ───────────────────────── Seminars (first 5) ─────────────────────────
  {
    slug: "insider-series-3-ep-03",
    title: "Insider Series 3.0 - Ep 03",
    category: "Seminar",
    date: "2026-02-11",
    displayDate: "11th February 2026",
    time: "08:00 PM - 09:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series(3).png",
    tagline: "Tech Roles Explained: ctc vs in-hand",
    summary:
      "Tech Roles Explained: ctc vs in-hand with Radhika Bansal, Software Developer @ Uber.",
    about: [
      "Salary conversations rarely feature in college, yet they shape how you read your first offer letter. In Episode 3 of Insider Series 3.0, Radhika Bansal, a Software Developer at Uber, explained the difference between CTC and in-hand pay for tech roles.",
      insiderAbout,
    ],
    highlights: [
      "Episode 3 of Insider Series 3.0",
      "Speaker: Radhika Bansal, Software Developer @ Uber",
      "Online session, 8:00 PM – 9:00 PM",
    ],
    takeaways: [
      "How CTC is structured and why it differs from take-home pay",
      "What to look for in an offer letter beyond the headline number",
      "How to compare offers across roles and companies",
    ],
    whoFor: [
      "Pre-final and final year students preparing for placements",
      "Anyone about to receive their first tech offer",
    ],
    speakers: [{ name: "Radhika Bansal", role: "Software Developer @ Uber" }],
    tags: ["uber", "ctc", "salary", "offer", "insider series"],
  },
  {
    slug: "insider-series-3-ep-02",
    title: "Insider Series 3.0 - Ep 02",
    category: "Seminar",
    date: "2026-02-10",
    displayDate: "10th February 2026",
    time: "09:00 PM - 10:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series(2).png",
    tagline: "How to secure a DRDO Intern",
    summary: "How to secure a DRDO Intern with Anusha Mahajan, Product @ Fabric.",
    about: [
      "A DRDO internship is one of the most sought-after research opportunities for engineering students, but the path to it is rarely obvious. In Episode 2 of Insider Series 3.0, Anusha Mahajan, Product at Fabric, shared how to go about securing one.",
      insiderAbout,
    ],
    highlights: [
      "Episode 2 of Insider Series 3.0",
      "Speaker: Anusha Mahajan, Product @ Fabric",
      "Online session, 9:00 PM – 10:00 PM",
    ],
    takeaways: [
      "How to find DRDO internship openings and apply",
      "How to put together an application that gets noticed",
      "What to expect from a research internship and how to prepare for it",
    ],
    whoFor: [
      "Students interested in research, defence technology and government labs",
      "First and second-year students planning an early internship",
    ],
    speakers: [{ name: "Anusha Mahajan", role: "Product @ Fabric" }],
    tags: ["drdo", "internship", "research", "insider series"],
  },
  {
    slug: "insider-series-3-ep-01",
    title: "Insider Series 3.0 - Ep 01",
    category: "Seminar",
    date: "2026-02-09",
    displayDate: "9th February 2026",
    time: "08:00 PM - 09:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series(1).png",
    tagline: "Resume and LinkedIn optimisation",
    summary:
      "Resume and LinkedIn optimisation with Sripriya Aggarwal, Founder @TechNeeds.",
    about: [
      "Your resume and LinkedIn profile are often the first thing a recruiter sees. Episode 1 of Insider Series 3.0 opened the season with Sripriya Aggarwal, Founder of TechNeeds, on how to make both work harder for you, including how the LinkedIn algorithm works.",
      insiderAbout,
    ],
    highlights: [
      "Episode 1 of Insider Series 3.0",
      "Speaker: Sripriya Aggarwal, Founder @TechNeeds",
      "Online session, 8:00 PM – 9:00 PM",
    ],
    takeaways: [
      "How to structure a resume that recruiters can scan quickly",
      "How to optimise your LinkedIn headline, summary and profile",
      "How the LinkedIn algorithm works and how to be more visible on it",
    ],
    whoFor: [
      "Students preparing their first resume or LinkedIn profile",
      "Anyone applying for internships and placements this season",
    ],
    speakers: [{ name: "Sripriya Aggarwal", role: "Founder @TechNeeds" }],
    tags: ["resume", "linkedin", "career", "insider series"],
  },
  {
    slug: "insider-series-2-ep-04",
    title: "Insider Series 2.0 - Ep 04",
    category: "Seminar",
    date: "2024-11-18",
    displayDate: "18th November 2024",
    time: "07:00 PM - 08:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series 2.0 (4).png",
    tagline: "Guide to the FFE Scholarship & Amazon Internship",
    summary:
      "Guide to the FFE Scholarship & Amazon Internship with Tanisha Bansal.",
    about: [
      "Episode 4 of Insider Series 2.0 was a practical guide to two opportunities: the FFE Scholarship and an internship at Amazon. Tanisha Bansal shared her experience with both.",
      insiderAbout,
    ],
    highlights: [
      "Episode 4 of Insider Series 2.0",
      "Speaker: Tanisha Bansal",
      "Online session, 7:00 PM – 8:00 PM",
    ],
    takeaways: [
      "What the FFE Scholarship offers and how to apply",
      "How to prepare for the Amazon internship selection process",
      "How scholarships and internships can complement each other on your profile",
    ],
    whoFor: [
      "Students looking for scholarships alongside internships",
      ...insiderWhoFor,
    ],
    speakers: [{ name: "Tanisha Bansal" }],
    tags: ["ffe", "scholarship", "amazon", "internship", "insider series"],
  },
  {
    slug: "insider-series-2-ep-03",
    title: "Insider Series 2.0 - Ep 03",
    category: "Seminar",
    date: "2024-11-17",
    displayDate: "17th November 2024",
    time: "08:00 PM - 09:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series 2.0 (3).png",
    tagline: "Living the Google Dream: The Path to Google STEP",
    summary:
      "Living the Google Dream: The Path to Google STEP with Rishita Makde and Ayushi Arora.",
    about: [
      "Episode 3 of Insider Series 2.0, \"Living the Google Dream\", was about the path to Google's STEP internship. Rishita Makde and Ayushi Arora shared how they got there and what helped along the way.",
      insiderAbout,
    ],
    highlights: [
      "Episode 3 of Insider Series 2.0",
      "Speakers: Rishita Makde and Ayushi Arora",
      "Online session, 8:00 PM – 9:00 PM",
    ],
    takeaways: [
      "What the Google STEP internship is and who can apply",
      "How to prepare for the application and interview rounds",
      "How to build a profile that stands out early in college",
    ],
    whoFor: [
      "First and second-year students aiming for early-career internships",
      ...insiderWhoFor,
    ],
    speakers: [{ name: "Rishita Makde" }, { name: "Ayushi Arora" }],
    tags: ["google", "step", "internship", "insider series"],
  },

  // ───────────────────────── Bootcamp ─────────────────────────
  {
    slug: "bootcamp-24",
    title: "Bootcamp'24",
    category: "Bootcamp",
    date: "2024-07-01",
    displayDate: "July-August, 2024",
    time: "10:00 AM",
    mode: "Online",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947654/bootcamp_modal_cauj6h.jpg",
    tagline: "The spirit of the season",
    summary:
      "The 2024 edition of MSC IGDTUW's Summer Bootcamp, run under the AI-DS department of IGDTUW.",
    about: [
      "The Summer Bootcamp is the flagship mentorship programme of the Microsoft Student Chapter, IGDTUW, run under the AI-DS department of the university. The 2024 edition ran across July and August, online, with the theme \"the spirit of the season\".",
      "The bootcamp is built around hands-on learning, with peers and mentors guiding participants through in-demand tech skills over several weeks.",
    ],
    highlights: [
      "Organised under the AI-DS department, IGDTUW",
      "Ran through July–August 2024, online",
      "Mentor-led, hands-on format",
    ],
    takeaways: [
      "A structured, multi-week start in in-demand tech skills",
      "Guidance from peers and mentors who have been through it",
      "Practical, project-style learning you can add to your portfolio",
    ],
    whoFor: [
      "Beginners and first-year students looking for a guided start in tech",
      "Anyone who wants to use the summer break to build real skills",
    ],
    tags: ["bootcamp", "summer", "mentorship", "learning"],
  },
  // ───────────────────────── Competitions ─────────────────────────
  {
    slug: "ideate-it-up-2026",
    title: "Ideate-it-Up 2026",
    category: "Competition",
    date: "2026-03-18",
    displayDate: "18th March 2026",
    mode: "Offline",
    venue: "IGDTUW",
    image: "/images/Ideate-it-up.png",
    tagline: "Think. Create. Elevate.",
    summary:
      "Turning 3 AM ideas into real impact, an ideathon for solo minds and teams alike.",
    about: [
      "Ideate-it-Up 2026 is an ideathon built around one belief: the best ideas often show up at 3 AM, and they deserve a stage. Open to solo participants and teams alike, it invited students to turn a rough concept into a well-thought-out solution.",
      "Participants submitted their ideas ahead of the 20th February deadline, and the finals were held on campus at IGDTUW, where ideas were presented and evaluated in person.",
      "The event was powered by MSC IGDTUW in collaboration with Innerve, the annual technical fest of the university.",
    ],
    highlights: [
      "Open to solo participants and teams of 2–3",
      "Idea submission deadline: 20th February 2026",
      "Grand finals held on campus at IGDTUW",
      "Powered by MSC IGDTUW × Innerve",
    ],
    takeaways: [
      "How to take a raw idea and shape it into a clear problem–solution story",
      "Practice pitching and defending an idea in front of an evaluation panel",
      "Experience of working to a deadline, alone or as part of a small team",
    ],
    whoFor: [
      "Students from any branch or year with an idea worth exploring",
      "First-time participants, since no prior hackathon experience is needed",
      "Solo thinkers and small teams who want feedback on their ideas",
    ],
    partners: ["Innerve"],
    tags: ["ideathon", "innovation", "innerve", "pitch"],
  },
  {
    slug: "hack-it-up-2025",
    title: "Hack-it-up 2025",
    category: "Competition",
    date: "2025-02-18",
    displayDate: "18th February, 2025",
    time: "9:00 AM",
    mode: "Hybrid", 
    venue: "Seminar Hall, IGDTUW",
    image: "/images/HACK-IT-UP-HomePage.jpg",
    tagline: "Code, Create, Conquer",
    summary:
      "MSC IGDTUW's signature hackathon: build bold, ship fast and turn ideas into working products.",
    about: [
      "Hack-it-up is the signature hackathon of the Microsoft Student Chapter, IGDTUW. The idea is simple: build bold, ship fast and turn caffeine-fuelled ideas into working products.",
      "The 2025 edition, themed \"Code, Create, Conquer\", kicked off on 18th February 2025 at the Seminar Hall, IGDTUW, with prizes worth 10L+ and swags and goodies for participants.",
      "Registrations closed on 10th February 2025.",
    ],
    highlights: [
      "Prizes worth 10L+",
      "Free swags & goodies for participants",
      "Last date to register: 10th February 2025",
      "Kick-off at 9:00 AM, Seminar Hall, IGDTUW",
    ],
    takeaways: [
      "Hands-on experience taking a product from idea to working prototype",
      "How to plan, divide work and ship as a team under time pressure",
      "Exposure to demoing your build and getting feedback from judges and peers",
    ],
    whoFor: [
      "Students who like building things, from beginners to experienced developers",
      "Teams looking for a challenge, networking and a chance to win",
      "Designers, developers and problem-solvers who want to collaborate",
    ],
    tags: ["hackathon", "flagship", "prizes", "build"],
  },

  // ───────────────────────── Seminars (last 5) ─────────────────────────
  {
    slug: "insider-series-2-ep-02",
    title: "Insider Series 2.0 - Ep 02",
    category: "Seminar",
    date: "2024-11-16",
    displayDate: "16th November 2024",
    time: "07:00 PM - 08:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series 2.0 (2).png",
    tagline: "Cracking Uber She++ and UberSTAR Internship",
    summary:
      "Cracking Uber She++ and UberSTAR Internship with Prakriti Rai and Payal Narwal.",
    about: [
      "Episode 2 of Insider Series 2.0 focused on two opportunities at Uber aimed at students: the Uber She++ programme and the UberSTAR internship. Prakriti Rai and Payal Narwal shared their journeys and what it takes to crack them.",
      insiderAbout,
    ],
    highlights: [
      "Episode 2 of Insider Series 2.0",
      "Two speakers sharing first-hand experience",
      "Online session, 7:00 PM – 8:00 PM",
    ],
    takeaways: [
      "What the Uber She++ programme and the UberSTAR internship are and who they're for",
      "How to approach the application and selection process",
      "How to prepare, and what to focus on, from first-hand experience",
    ],
    whoFor: [
      "Women in tech looking for programmes and internships to apply to",
      ...insiderWhoFor,
    ],
    speakers: [{ name: "Prakriti Rai" }, { name: "Payal Narwal" }],
    tags: ["uber", "internship", "she++", "uberstar", "insider series"],
  },
  {
    slug: "insider-series-2-ep-01",
    title: "Insider Series 2.0 - Ep 01",
    category: "Seminar",
    date: "2024-11-15",
    displayDate: "15th November 2024",
    time: "07:00 PM - 08:00 PM",
    mode: "Online",
    venue: "Online",
    image: "/images/Insider-series 2.0 (1).png",
    tagline: "The Tech Tea: Google WE Scholar Experience",
    summary:
      "The Tech Tea: Google WE Scholar Experience with Navya Verma and Devika Jain.",
    about: [
      "The opening episode of Insider Series 2.0, \"The Tech Tea\", was an informal, conversational session on the Google WE Scholar experience. Navya Verma and Devika Jain shared what the journey looked like from application to scholarship.",
      insiderAbout,
    ],
    highlights: [
      "Episode 1 of Insider Series 2.0",
      "Two Google WE Scholars sharing their experience",
      "Online session, 7:00 PM – 8:00 PM",
    ],
    takeaways: [
      "What the Google WE Scholar programme involves and how it can help your career",
      "How the application process looked from the scholars' side",
      "Practical advice on preparing and presenting a strong application",
    ],
    whoFor: [
      "Women in tech interested in scholarships and early-career programmes",
      ...insiderWhoFor,
    ],
    speakers: [{ name: "Navya Verma" }, { name: "Devika Jain" }],
    tags: ["google", "scholarship", "we scholar", "insider series"],
  },
  {
    slug: "insider-series-3",
    title: "Insider Series 3",
    category: "Seminar",
    date: "2023-08-18",
    displayDate: "18th August, 2023",
    time: "2:00 PM",
    mode: "Online",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694948714/insider3_o5pmzb.png",
    tagline: "All about Cracking FAANGM",
    summary: "An Insider Series session on cracking FAANGM companies.",
    about: [
      "The third session of the original Insider Series, \"All about Cracking FAANGM\", looked at how students can prepare for roles at the biggest names in tech.", // VERIFY: add speaker + agenda
      insiderAbout,
    ],
    highlights: [
      "Third session of the original Insider Series",
      "Online session, 2:00 PM",
    ],
    takeaways: [
      "What big-tech hiring processes typically look like",
      "How to build the skills and profile these companies look for",
      "How to plan your preparation from early college years",
    ],
    whoFor: [
      "Students aiming for roles at product and big-tech companies",
      ...insiderWhoFor,
    ],
    tags: ["faangm", "big tech", "placements", "insider series"],
  },
  {
    slug: "insider-series-2",
    title: "Insider Series 2",
    category: "Seminar",
    date: "2023-07-23",
    displayDate: "23rd July, 2023",
    time: "3:00 PM",
    mode: "Online",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947655/insider2_pikd3s.jpg",
    tagline: "All about the MLH Fellowship",
    summary: "An Insider Series session on the MLH Fellowship.",
    about: [
      "The second session of the original Insider Series, \"All about the MLH Fellowship\", introduced students to Major League Hacking's fellowship and how to get started with it.", // VERIFY: add speaker + agenda
      insiderAbout,
    ],
    highlights: [
      "Second session of the original Insider Series",
      "Online session, 3:00 PM",
    ],
    takeaways: [
      "What the MLH Fellowship is and what fellows work on",
      "How to prepare for the application and selection process",
      "How open-source and project experience can strengthen your profile",
    ],
    whoFor: [
      "Students interested in open source and hands-on engineering experience",
      ...insiderWhoFor,
    ],
    tags: ["mlh", "fellowship", "open source", "insider series"],
  },
  {
    slug: "insider-series-1",
    title: "Insider Series 1",
    category: "Seminar",
    date: "2023-06-20",
    displayDate: "20th June, 2023",
    time: "11:00 AM",
    mode: "Online",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947655/insider1_v7omv0.jpg",
    tagline: "All about Flipkart GRID",
    summary: "The very first Insider Series session, on Flipkart GRID.",
    about: [
      "The Insider Series began with this session, \"All about Flipkart GRID\", an introduction to Flipkart's student engineering challenge and how to take part.", // VERIFY: add speaker + agenda
      insiderAbout,
    ],
    highlights: [
      "The first session of Insider Series",
      "Online session, 11:00 AM",
    ],
    takeaways: [
      "What Flipkart GRID is and how its stages work",
      "How to prepare for the rounds and build a strong submission",
      "How competitions like this can open doors to internships and jobs",
    ],
    whoFor: [
      "Students who want to compete in industry-run challenges",
      ...insiderWhoFor,
    ],
    tags: ["flipkart", "grid", "competition", "insider series"],
  },

  // ───────────────────────── Bootcamp ─────────────────────────
  {
    slug: "bootcamp-23",
    title: "Bootcamp'23",
    category: "Bootcamp",
    date: "2023-06-05",
    displayDate: "5th June, 2023",
    time: "9:00 AM",
    mode: "Online",
    venue: "Online",
    image:
      "https://res.cloudinary.com/duxmh9dws/image/upload/v1694947654/bootcamp_modal_cauj6h.jpg",
    tagline: "The spirit of the season",
    summary:
      "The first MSC IGDTUW Summer Bootcamp, run under the AI-DS department of IGDTUW.", // VERIFY: "first" is inferred from Bootcamp 3.0 being the 2025 edition
    about: [
      "The Summer Bootcamp is the flagship mentorship programme of the Microsoft Student Chapter, IGDTUW, run under the AI-DS department of the university. The 2023 edition kicked off on 5th June 2023 with the theme \"the spirit of the season\".",
      "The bootcamp is built around hands-on learning, with peers and mentors guiding participants through in-demand tech skills.",
    ],
    highlights: [
      "Organised under the AI-DS department, IGDTUW",
      "Kick-off on 5th June 2023 at 9:00 AM, online",
      "Mentor-led, hands-on format",
    ],
    takeaways: [
      "A structured start in in-demand tech skills",
      "Guidance from peers and mentors who have been through it",
      "Practical, project-style learning you can add to your portfolio",
    ],
    whoFor: [
      "Beginners and first-year students looking for a guided start in tech",
      "Anyone who wants to use the summer break to build real skills",
    ],
    tags: ["bootcamp", "summer", "mentorship", "learning"],
  },
];
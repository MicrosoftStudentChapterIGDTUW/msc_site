"use client";

import PillNav from "@/components/PillNav";
import Aurora from "@/components/Aurora";
import Tilt from "./Tilt";
import { Anton } from "next/font/google";
import Footer from "@/components/Footer";


const anton = Anton({
  subsets: ["latin"],
  weight: "400",
});

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  socials: {
    instagram: string;
    linkedin: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Amaira Aggarwal",
    role: "PRESIDENT",
    imageUrl: "/team_images/amaira.jpg",
    socials: {
      instagram: "https://www.instagram.com/amairaa_agg/",
      linkedin: "https://www.linkedin.com/in/amaira-aggarwal-981b73283",
    },
  },
  {
    name: "Nandini Bansal",
    role: "PRESIDENT",
    imageUrl: "/team_images/nandini.png",
    socials: {
      instagram: "https://www.instagram.com/im__peehu?igsh=MWgxNHlnMTVkNHAyaQ%3D%3D",
      linkedin: "https://www.linkedin.com/in/nandinibansal1524/",
    },
  },
  {
    name: "Urvashi Yadav",
    role: "SECRETARY",
    imageUrl: "/team_images/UrvashiYadavSec.jpg",
    socials: {
      instagram: "https://instagram.com/amaira",
      linkedin: "https://www.linkedin.com/in/urvashiyadav2004/",
    },
  },
  {
    name: "Daisy Sorokhaibam",
    role: "SECRETARY",
    imageUrl: "/team_images/DaisySorokhaibamSecretary.png",
    socials: {
      instagram: "https://www.instagram.com/daisythekermit/",
      linkedin: "https://www.linkedin.com/in/daisy-sorokhaibam-0bab4a280/",
    },
  },
  {
    name: "Anshika Sharma",
    role: "WEB DEVELOPMENT LEAD",
    imageUrl: "/team_images/AnshikaSharma_Webd.png",
    socials: {
      instagram: "https://www.instagram.com/anshikaa_2024/",
      linkedin: "https://www.linkedin.com/in/anshika-sharma-8b578822a/",
    },
  },
  {
    name: "Arzoo Patra",
    role: "MEDIA LEAD",
    imageUrl: "/team_images/ArzooPatra_MediaTeam_Lead.jpg",
    socials: {
      instagram: "https://www.instagram.com/arzivelle",
      linkedin: "https://www.linkedin.com/in/arzoopatra/",
    },
  },
  {
    name: "Shreya Tejan",
    role: "CONTENT LEAD",
    imageUrl: "/team_images/shreya_tejan.jpg",
    socials: {
      instagram: "https://www.instagram.com/shreya_officio/",
      linkedin: "https://www.linkedin.com/in/shreyatejan/",
    },
  },
  {
    name: "Shreya Gupta",
    role: "EVENT MANAGEMENT LEAD",
    imageUrl: "/team_images/Shreya Gupta_EM.jpg",
    socials: {
      instagram: "https://instagram.com/amaira",
      linkedin: "https://www.linkedin.com/in/shreya-gupta-a783b9270/",
    },
  },
  {
    name: "Vedanshi Mishra",
    role: "PUBLIC RELATIONS LEAD",
    imageUrl: "/team_images/VedanshiPrLead.png",
    socials: {
      instagram: "https://instagram.com/amaira",
      linkedin: "https://www.linkedin.com/in/vedanshi-mishra-315572280/",
    },
  },
  {
    name: "SIYA KHETAN",
    role: "SPONSORSHIP LEAD",
    imageUrl: "/team_images/SiyaKhetanSponsiHead.png",
    socials: {
      instagram: "https://www.instagram.com/_siyakhetan",
      linkedin: "https://www.linkedin.com/in/siya-khetan-b95267252/",
    },
  },
];

export default function TeamPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
      {/* Background SVG (visible now) */}
      <div className="background-with-svg fixed inset-0 z-0" />

      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
          blend={1}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Sticky Navbar (above backgrounds) */}
      <div className="relative z-50">
        <PillNav
          logo="/logo.png"
          logoAlt="MSC Logo"
          items={[
            { label: "Home", href: "/" },
            { label: "About us", href: "/#about" },
            { label: "Events", href: "/#events" },
            { label: "Blogs", href: "/#blogs" },
            { label: "Team", href: "/team" },
            { label: "Contact us", href: "/contact" },
            { label: "FAQ", href: "/#faq" },
          ]}
          activeHref="/team"
          className="custom-nav"
          baseColor="#ffffff"
          pillColor="#0066cc"
          hoveredPillTextColor="#ffffff"
        />
      </div>
      {/* Page Header */}
      <div className="relative z-20 pt-30 text-center">
        <h1 className={`${anton.className} uppercase text-[2.8rem] sm:text-[4.5rem] font-normal tracking-[0.12em] text-[#4cc9ff] drop-shadow-[0_0_12px_rgba(76,201,255,0.5)]`}>
          MEET THE TEAM
        </h1>

          <p
            className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed tracking-[0.05em] font-[Roboto] font-bold text-white"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Meet our passionate innovators and future tech leaders, empowered by
            Microsoft technologies in our vibrant college community.
          </p>
      </div>


      {/* Page Header
      <div className="relative z-20 pt-40 text-center">
        <h1 className={`${anton.className} text-5xl sm:text-7xl tracking-wide`}>
          MEET THE <span className="text-[#AEC4FF]">TEAM</span>
        </h1>

        <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-300">
          Meet our passionate innovators and future tech leaders, empowered by
          Microsoft technologies in our vibrant college community.
        </p>
      </div> */}

      {/* Team Cards */}
      <div className="relative z-20 mt-20 w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 max-w-5xl">
          {teamMembers.map((member, index) => (
            <Tilt key={index} className="rounded-xl glow-card group">
              <div className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-[320px] h-[350px] bg-black/40 backdrop-blur-md border border-white/10 mx-auto">

                {/* Image */}
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Info */}
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-blue-300 font-semibold">
                    {member.role}
                  </p>

                  {/* Social Icons */}
                  <div className="flex gap-4 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    {/* Instagram */}
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      className="hover:text-pink-400 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.5 2A5.5 5.5 0 002 7.5v9A5.5 5.5 0 007.5 22h9a5.5 5.5 0 005.5-5.5v-9A5.5 5.5 0 0016.5 2h-9zM12 7a5 5 0 110 10 5 5 0 010-10zm6-1.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      className="hover:text-blue-400 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.98 3.5A2.5 2.5 0 107.5 6a2.5 2.5 0 00-2.52-2.5zM3 8.98h4V21H3V8.98zM9 8.98h3.67v1.65h.05c.51-.97 1.76-2 3.63-2C19.43 8.63 21 10.08 21 13.39V21h-4v-6.23c0-1.49-.03-3.42-2.09-3.42-2.1 0-2.42 1.64-2.42 3.31V21H9V8.98z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="relative z-20 mt-24">
        <Footer />
      </div>
    </div>
  );
}

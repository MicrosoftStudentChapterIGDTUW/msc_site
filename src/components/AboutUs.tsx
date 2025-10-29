'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'motion/react';
import './AboutUs.css';

const galleryItems = [
  { title: 'Engaging Sessions', image: '/images/gallery-auditorium.jpg' },
  { title: 'Core Team', image: '/images/gallery-team.jpg' },
  { title: 'Hack-It-Up 2025', image: '/images/gallery-hackitup.jpg' },
  { title: 'Workshops & Talks', image: '/images/gallery-auditorium.jpg' },
  { title: 'Networking Nights', image: '/images/gallery-team.jpg' },
];

const AboutUs: React.FC = () => {
  // slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: '20px',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="about-us-section" id="about">
      <div className="about-content">
        {/* Title Section */}
        <div className="mb-12">
          <motion.h1
            className="about-title"
            initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            ABOUT US
          </motion.h1>
          <p className="about-subtitle">
            We empower women technologists through collaboration, creativity, and innovation.
          </p>
        </div>

        {/* Sliding Gallery */}
        <section className="about-gallery">
          <Slider {...settings}>
            {galleryItems.map((item, index) => (
              <div key={index} className="px-3">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-blue-900/50 hover:scale-[1.02] transition duration-500">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-3xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src =
                        'https://placehold.co/600x400/0f172a/ffffff?text=Gallery+Image';
                    }}
                  />
                  <p className="py-3 text-blue-300 font-semibold bg-black/40 backdrop-blur-sm">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Description Section */}
        <div className="about-description">
          We are the{' '}
          <span className="text-blue-400 font-extrabold">
            MICROSOFT LEARN STUDENT AMBASSADOR STUDENT CHAPTER
          </span>
          , your one-stop spot for sessions, hackathons, and mentorship. Learn from experts,
          seniors, and peers as you grow into tomorrow's tech leaders.
        </div>
      </div>
    </section>
  );
};

export default AboutUs;


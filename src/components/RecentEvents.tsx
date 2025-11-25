'use client';

import React from 'react';
import { motion } from 'motion/react';
import TiltedCard from './TiltedCard';
import './RecentEvents.css';

const RecentEvents: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Summer Bootcamp',
      description:
        'For mentees to learn from their mentors — an initiative to make the most out of the summer and build real skills through guided mentorship.',
      image: '/images/summer_bootcamp.jpg',
    },
    {
      id: 2,
      title: 'HACK-IT-UP 2025',
      description:
        'A hackathon initiative for IGDTUW students to participate, build real-time projects, compete, collaborate, and push each other to innovate.',
      image: '/images/gallery-hackitup.jpg',
    },
  ];

  return (
    <section className="recent-events-section">
      <div className="recent-events-content">

        <motion.h2
          className="recent-events-title"
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          RECENT EVENTS
        </motion.h2>

        <div className="recent-events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card-wrapper">
              
              <TiltedCard
                imageSrc={event.image}
                altText={event.title}
                captionText={event.title}
                containerHeight="380px"      // FINAL FIX
                containerWidth="400px"
                scaleOnHover={1.06}
                rotateAmplitude={10}
                showMobileWarning={false}
                showTooltip={false}
              >
                <div className="event-card-content">
                  <h3 className="event-card-title">{event.title}</h3>
                </div>
              </TiltedCard>

              <p className="event-bottom-description">{event.description}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentEvents;

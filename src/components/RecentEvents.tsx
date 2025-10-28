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
      description: 'Under the AI-DS Department, IGDTUW — the spirit of the season.',
      image: '/images/summer_bootcamp.jpg',
    },
    {
      id: 2,
      title: 'HACK-IT-UP 2025',
      description: 'Igdtuw-hackathon • the hackathon for 25.',
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
          {events.map((event, index) => (
            <TiltedCard
              key={event.id}
              imageSrc={event.image}
              altText={event.title}
              captionText={event.title}
              containerHeight="450px"
              containerWidth="350px"
              imageHeight="250px"
              imageWidth="100%"
              scaleOnHover={1.05}
              rotateAmplitude={12}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            >
              <div className="event-card-content">
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-description">{event.description}</p>
              </div>
            </TiltedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentEvents;


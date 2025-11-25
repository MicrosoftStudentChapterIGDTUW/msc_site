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
      description: 'IGDTUW-Hackathon - The hackathon for 2025.',
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
          viewport={{ once: false }}
        >
          RECENT EVENTS
        </motion.h2>

        <div className="recent-events-grid">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            >
              <TiltedCard
                imageSrc={event.image}
                altText={event.title}
                captionText={event.title}
                containerHeight="450px"
                containerWidth="350px"
                scaleOnHover={1.05}
                rotateAmplitude={12}
                showMobileWarning={false}
                showTooltip={false}
              >
                <div className="event-card-content">
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-description">{event.description}</p>
                </div>
              </TiltedCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentEvents;


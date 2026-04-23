'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './SponsorsMarquee.module.css';

type Sponsor = {
  id: number;
  name: string;
  description: string;
  logo: string;
  glow: string;
};

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: 'Rise In',
    description: 'Education initiative supporting student growth.',
    logo: '/images/risein.png',
    glow: '#4F46E5',
  },
  {
    id: 2,
    name: 'AlgoPrep',
    description: 'Platform for interview and coding preparation.',
    logo: '/images/algoprep.png',
    glow: '#1E88E5',
  },
  {
    id: 3,
    name: 'DoraHacks',
    description: 'Global hackathon and Web3 builder community.',
    logo: '/images/dorahacks.png',
    glow: '#FF9800',
  },
  {
    id: 4,
    name: 'HackerRank',
    description: 'Coding practice and skills assessment platform.',
    logo: '/images/hackerrank.png',
    glow: '#00EA64',
  },
  {
    id: 5,
    name: 'GFG',
    description: 'CS learning and interview prep platform.',
    logo: '/images/gfg.png',
    glow: '#2F8D46',
  },
  {
    id: 6,
    name: 'InterviewBuddy',
    description: 'Mock interviews and technical practice sessions.',
    logo: '/images/interviewbuddy.png',
    glow: '#0096FF',
  },
  {
    id: 7,
    name: 'Unstop',
    description: 'Competitions, jobs, and student opportunities.',
    logo: '/images/unstop.png',
    glow: '#5C2D91',
  },
  {
    id: 8,
    name: 'Eduquest Education',
    description: 'Coaching and career guidance platform.',
    logo: '/images/eduquesteducation.jpeg',
    glow: '#0A74DA',
  },
  {
    id: 9,
    name: 'My Certificate',
    description: 'Digital certification and verification service.',
    logo: '/images/mycertificate.png',
    glow: '#1A73E8',
  },
  {
    id: 10,
    name: 'Fueler',
    description: 'Portfolio-based opportunity platform.',
    logo: '/images/fueler.svg',
    glow: '#8B5CF6',
  },
  {
    id: 11,
    name: 'Certopus Support',
    description: 'Certification automation and support system.',
    logo: '/images/certopus.png',
    glow: '#2CD4D9',
  },
  {
    id: 12,
    name: 'StockEdge',
    description: 'Market education, analysis tools, and insights.',
    logo: '/images/stockedge.png',
    glow: '#003F88',
  },
  {
    id: 13,
    name: 'Banyan Nation',
    description: 'Sustainability and plastic recycling partner.',
    logo: '/images/banyannation.png',
    glow: '#4CAF50',
  },
];

const marqueeItems = [...sponsors, ...sponsors];

const SponsorsMarquee: React.FC = () => {
  return (
    <section id="sponsors" className={styles.section} aria-labelledby="sponsors-heading">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, amount: 0.4 }}
        >
          <h2 id="sponsors-heading" className={styles.title}>
            OUR SPONSORS
          </h2>
          <p className={styles.subtitle}>
            Supporters helping us build opportunities, skills, and community.
          </p>
        </motion.div>

        <div className={styles.marquee}>
          <div className={styles.track}>
            {marqueeItems.map((sponsor, index) => (
              <article
                key={`${sponsor.id}-${index}`}
                className={styles.card}
                style={{ ['--glow' as never]: sponsor.glow } as React.CSSProperties}
              >
                <div className={styles.logoBox}>
                  <div className={styles.logoGlow} />
                  <img src={sponsor.logo} alt={sponsor.name} className={styles.logo} />
                </div>
                <h3 className={styles.cardTitle}>{sponsor.name}</h3>
                <p className={styles.cardText}>{sponsor.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsMarquee;
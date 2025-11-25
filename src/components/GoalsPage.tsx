'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import ShinyText from './ShinyText';
import './GoalsPage.css';

const GoalsPage: React.FC = () => {
  const goals = [
    {
      title: "DECIDE",
      description: "We will help you decide the best way ahead by providing you the right information.",
      direction: "right"
    },
    {
      title: "LEARN", 
      description: "We will help you learn what you need to by exclusive events, sessions and webinars.",
      direction: "left"
    },
    {
      title: "APPLY",
      description: "Having skills is one thing and applying that at right place is another. We will bridge the gap.",
      direction: "right"
    }
  ];

  return (
    <div className="goals-page" id="goals">
      {/* Arrow SVG - Static in center */}
      <motion.div 
        className="goals-arrow-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <img src="/arrow.svg" alt="Goals Arrow" className="goals-arrow" />
      </motion.div>

      {/* OUR GOALS Title - Drops with arrow, then appears */}
      <motion.div
        className="goals-title-container"
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <ShinyText 
          text="OUR GOALS" 
          speed={3}
          className="goals-page-title"
        />
      </motion.div>

      {/* Goal 1 - First goal animation */}
      <motion.div
        className="goal-1-container"
        initial={{ opacity: 0, y: -80, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <img src="/Goal1.svg" alt="Goal 1" className="goal-svg" />
      </motion.div>

      {/* Goal 3 - Second goal animation */}
      <motion.div
        className="goal-3-container"
        initial={{ opacity: 0, y: -80, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <img src="/goal3.svg" alt="Goal 3" className="goal-svg" />
      </motion.div>

      {/* Goal 2 - Third goal animation */}
      <motion.div
        className="goal-2-container"
        initial={{ opacity: 0, y: -80, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeInOut" } }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <img src="/Goal2.svg" alt="Goal 2" className="goal-svg" />
      </motion.div>
    </div>
  );
};

export default GoalsPage;

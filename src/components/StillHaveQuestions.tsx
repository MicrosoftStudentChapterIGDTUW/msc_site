'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import './StillHaveQuestions.css';

const StillHaveQuestions: React.FC = () => {
  return (
    <motion.section 
      className="still-have-questions-section" 
      id="contact"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: false }}
    >
      <motion.div 
        className="still-have-questions-content"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false }}
      >
        <h2 className="still-have-questions-title">
          Still have questions?
        </h2>
        <p className="still-have-questions-subtitle">
          Can&apos;t find the answer you&apos;re looking for? Please reach out to our friendly team.
        </p>

        <Link href="/contact">
          <motion.button
            className="still-have-questions-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Contact Us
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default StillHaveQuestions;


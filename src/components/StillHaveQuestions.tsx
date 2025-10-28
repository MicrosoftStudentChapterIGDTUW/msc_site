'use client';

import React from 'react';
import { motion } from 'motion/react';
import './StillHaveQuestions.css';

const StillHaveQuestions: React.FC = () => {
  return (
    <section className="still-have-questions-section" id="contact">
      <div className="still-have-questions-content">
        <h2 className="still-have-questions-title">Still have questions?</h2>
        <p className="still-have-questions-subtitle">
          Can't find the answer you're looking for? Please reach out to our friendly team.
        </p>

        <motion.button
          className="still-have-questions-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Contact Us
        </motion.button>
      </div>
    </section>
  );
};

export default StillHaveQuestions;


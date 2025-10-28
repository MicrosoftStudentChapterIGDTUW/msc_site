'use client';

import React from 'react';
import RotatingText from './RotatingText';

const JourneyText: React.FC = () => {
  return (
    <div className="journey-text-container">
      <span className="journey-prefix">Your journey to</span>
      <div className="journey-typing-wrapper">
        <RotatingText
          texts={["knowledge", "success", "skills"]}
          mainClassName="px-2 sm:px-2 md:px-2 bg-[#0066cc] text-white overflow-hidden py-0.5 sm:py-0.5 md:py-1 justify-center rounded-md leading-tight"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </div>
    </div>
  );
};

export default JourneyText;

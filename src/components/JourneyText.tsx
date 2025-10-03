'use client';

import React from 'react';
import TextType from './TextType';

const JourneyText: React.FC = () => {
  return (
    <div className="journey-text-container">
      <span className="journey-prefix">YOUR JOURNEY TO</span>
      <div className="journey-typing-wrapper">
        <TextType 
          text={["KNOWLEDGE", "SUCCESS", "SKILLS"]}
          typingSpeed={100}
          pauseDuration={2000}
          deletingSpeed={50}
          showCursor={true}
          cursorCharacter="|"
          className="journey-typing"
          textColors={["#ffffff", "#ffffff", "#ffffff"]}
        />
      </div>
    </div>
  );
};

export default JourneyText;

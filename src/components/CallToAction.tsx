'use client';

import React from 'react';
import StarBorder from './StarBorder';
import JourneyText from './JourneyText';

const CallToAction: React.FC = () => {
  return (
    <div className="cta-container">
      <StarBorder
        as="button"
        className="cta-button"
        color="#60a5fa"
        speed="5s"
        thickness={1}
      >
        CALL TO ACTION
      </StarBorder>
      <JourneyText />
    </div>
  );
};

export default CallToAction;


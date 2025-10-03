'use client';

import React from 'react';
import StarBorder from './StarBorder';

const CallToAction: React.FC = () => {
  return (
    <div className="cta-container">
      <StarBorder
        as="button"
        className="cta-button"
        color="white"
        speed="5s"
        thickness={1}
      >
        CALL TO ACTION
      </StarBorder>
    </div>
  );
};

export default CallToAction;

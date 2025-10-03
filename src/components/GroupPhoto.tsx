'use client';

import React from 'react';
import Image from 'next/image';

const GroupPhoto: React.FC = () => {
  return (
    <div className="group-photo-container">
      <Image
        src="/pic.jpg"
        alt="Microsoft Student Chapter Group"
        width={1728}
        height={137}
        priority
        className="group-photo"
      />
    </div>
  );
};

export default GroupPhoto;

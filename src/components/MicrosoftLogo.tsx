'use client';

import React from 'react';
import Image from 'next/image';

const MicrosoftLogo: React.FC = () => {
  return (
    <div className="microsoft-logo">
              <Image
                src="/logo.png"
                alt="Microsoft Learn Student Ambassador"
                width={150}
                height={300}
                priority
                className="logo-image"
              />
    </div>
  );
};

export default MicrosoftLogo;

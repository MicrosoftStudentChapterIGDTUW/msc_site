"use client";

import React, { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tilt({ children, className }: TiltProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.4,
        scale: 1.05,
      });
    }

    return () => {
      (tiltRef.current as any)?.vanillaTilt?.destroy();
    };
  }, []);

  return (
    <div ref={tiltRef} className={className}>
      {children}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './GlassdoorNavbar.css';

const GlassdoorNavbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const navItems = ['ABOUT US', 'EVENTS', 'BLOGS', 'TEAM', 'CONTACT US', 'FAQ'];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      // Get the journey text element
      const journeyElement = document.querySelector('.journey-text-container');
      if (journeyElement) {
        const rect = journeyElement.getBoundingClientRect();
        // Show navbar when journey text has scrolled well past the viewport
        // User must scroll significantly past the journey section
        setIsVisible(rect.bottom < -300);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial position after a short delay to avoid hydration issues
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isMounted]);

  if (!isMounted || !isVisible) return null;

  return (
    <nav className="sticky-navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Image
            src="/logo.png"
            alt="Microsoft Learn Student Ambassador"
            width={50}
            height={100}
            priority
            className="logo-image"
          />
        </div>
        
        <div className="navbar-links">
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className={`nav-link ${index === 0 ? 'active' : ''}`}
            >
              {item}
              {index < navItems.length - 1 && <span className="nav-separator">•</span>}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default GlassdoorNavbar;

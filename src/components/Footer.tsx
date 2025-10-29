'use client';

import React from 'react';
import Image from 'next/image';
import './Footer.css';

const Footer: React.FC = () => {
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo">
          <Image 
            src="/logo.png" 
            alt="MSC Logo" 
            width={400} 
            height={400}
            className="footer-logo-img"
          />
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h3 className="footer-title">Links</h3>
          <ul className="footer-list">
            <li><a href="#" onClick={handleHomeClick}>Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#goals">Our Goals</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Address Section */}
        <div className="footer-address">
          <h3 className="footer-title">Address</h3>
          <p className="footer-text">IGDTUW<br />New Delhi, India</p>
        </div>

        {/* Get in Touch Section */}
        <div className="footer-social">
          <h3 className="footer-title">Get in Touch</h3>
          <div className="footer-social-icons">
            <a href="https://x.com/IgdtuwMsc" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/msc.igdtuw/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/msc-igdtuw/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright-section">
        <p className="footer-copyright">MLSA-IGDTUW © 2025 | All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


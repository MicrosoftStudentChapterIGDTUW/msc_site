'use client';

import React, { useState } from 'react';
import './MenuButton.css';

const MenuButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 100);
    setHoverTimeout(timeout);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsMenuOpen(true);
  };

  const menuItems = ['CONTACT US', 'FAQ', 'TEAM', 'ABOUT US', 'EVENTS', 'BLOGS'];

  return (
    <div className="menu-button-container">
      <button 
        className="menu-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        MENU
      </button>
      
      {isMenuOpen && (
        <div 
          className="menu-overlay"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="menu-content">
            <div className="menu-items">
              {menuItems.map((item, index) => (
                <div key={index} className="menu-item">{item}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuButton;

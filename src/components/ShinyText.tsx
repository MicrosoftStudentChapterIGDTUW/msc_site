import React from 'react';
import './ShinyText.css';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div 
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`} 
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <span className="shiny-text-base">{text}</span>
      <span 
        className="shiny-text-overlay" 
        style={{ animationDuration: animationDuration }}
      >
        {text}
      </span>
    </div>
  );
};

export default ShinyText;

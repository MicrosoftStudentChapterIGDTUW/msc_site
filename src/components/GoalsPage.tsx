'use client';

import React from 'react';
import './GoalsPage.css';

const GoalsPage: React.FC = () => {
  const goals = [
    {
      title: "DECIDE",
      description: "We will help you decide the best way ahead by providing you the right information.",
      direction: "right"
    },
    {
      title: "LEARN", 
      description: "We will help you learn what you need to by exclusive events, sessions and webinars.",
      direction: "left"
    },
    {
      title: "APPLY",
      description: "Having skills is one thing and applying that at right place is another. We will bridge the gap.",
      direction: "right"
    }
  ];

  return (
    <div className="goals-page">
      <div className="goals-content">
        <div className="goals-header">
          <h1 className="goals-title">OUR GOALS</h1>
        </div>
        
        <div className="goals-visualization">
          <div className="dartboard">
            <div className="dartboard-rings">
              <div className="ring outer"></div>
              <div className="ring middle"></div>
              <div className="ring inner"></div>
              <div className="ring center"></div>
            </div>
            <div className="dart-axis"></div>
          </div>
          
          <div className="goal-banners">
            {goals.map((goal, index) => (
              <div key={index} className={`goal-banner goal-${goal.direction}`}>
                <div className="banner-content">
                  <h3 className="banner-title">{goal.title}</h3>
                  <p className="banner-description">{goal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;

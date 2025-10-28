'use client';

import React, { useRef } from 'react';
import MicrosoftLogo from '@/components/MicrosoftLogo';
import ShinyText from '@/components/ShinyText';
import BlurText from '@/components/BlurText';
import GroupPhoto from '@/components/GroupPhoto';
import Aurora from '@/components/Aurora';
import CallToAction from '@/components/CallToAction';
import JourneyText from '@/components/JourneyText';
import MenuButton from '@/components/MenuButton';
import PillNav from '@/components/PillNav';
import GoalsPage from '@/components/GoalsPage';
import VariableProximity from '@/components/VariableProximity';

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('IGDTUW Animation completed!');
  };
  const titleContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {/* Global Background with SVG - now sticky */}
      <div className="background-with-svg"></div>
      
      {/* Global Aurora Background - now sticky */}
      <Aurora
        colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
        blend={1}
        amplitude={1.0}
        speed={1}
      />

      {/* Sticky Glass Pill Navbar */}
      <PillNav
        logo="/logo.png"
        logoAlt="MSC Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'About us', href: '#about' },
          { label: 'Events', href: '#events' },
          { label: 'Blogs', href: '#blogs' },
          { label: 'Team', href: '#team' },
          { label: 'Contact us', href: '#contact' },
          { label: 'FAQ', href: '#faq' },
        ]}
        activeHref="/"
        className="custom-nav"
        baseColor="#0066cc"
        pillColor="#0066cc"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#ffffff"
      />

      <div className="font-sans min-h-screen relative overflow-hidden">
        {/* Menu Button */}
        <MenuButton />

        {/* Microsoft Learn Student Ambassador Logo */}
        <MicrosoftLogo />

        {/* Main Title */}
        <div className="main-title" ref={titleContainerRef}>
          <VariableProximity
            label={'MICROSOFT STUDENT CHAPTER'}
            className={'shiny-title'}
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={titleContainerRef}
            radius={130}
            falloff={'linear'}
          />
          <VariableProximity
            label={'IGDTUW'}
            className={'subtitle'}
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 800, 'opsz' 30"
            containerRef={titleContainerRef}
            radius={110}
            falloff={'linear'}
          />
        </div>

        {/* Group Photo */}
        <GroupPhoto />

        {/* Call to Action Button */}
        <CallToAction />

        {/* Journey Text */}
        <JourneyText />
      </div>

      {/* Old navbar removed in favor of sticky PillNav */}

      {/* Goals Page - appears when scrolling down */}
      <GoalsPage />
    </>
  );
}

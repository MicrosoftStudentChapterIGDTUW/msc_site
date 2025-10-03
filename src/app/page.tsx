'use client';

import MicrosoftLogo from '@/components/MicrosoftLogo';
import ShinyText from '@/components/ShinyText';
import BlurText from '@/components/BlurText';
import GroupPhoto from '@/components/GroupPhoto';
import Aurora from '@/components/Aurora';
import CallToAction from '@/components/CallToAction';
import JourneyText from '@/components/JourneyText';
import MenuButton from '@/components/MenuButton';
import GlassdoorNavbar from '@/components/GlassdoorNavbar';
import GoalsPage from '@/components/GoalsPage';

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('IGDTUW Animation completed!');
  };

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

      <div className="font-sans min-h-screen relative overflow-hidden">
        {/* Menu Button */}
        <MenuButton />

        {/* Microsoft Learn Student Ambassador Logo */}
        <MicrosoftLogo />

        {/* Main Title */}
        <div className="main-title">
          <ShinyText 
            text="MICROSOFT STUDENT CHAPTER" 
            speed={4}
            className="shiny-title"
          />
          <BlurText
            text="IGDTUW"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="subtitle"
          />
        </div>

        {/* Group Photo */}
        <GroupPhoto />

        {/* Call to Action Button */}
        <CallToAction />

        {/* Journey Text */}
        <JourneyText />
      </div>

      {/* Sticky Navbar - appears when scrolling to Journey Text */}
      <GlassdoorNavbar />

      {/* Goals Page - appears when scrolling down */}
      <GoalsPage />
    </>
  );
}

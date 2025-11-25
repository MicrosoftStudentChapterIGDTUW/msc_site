'use client';

import MicrosoftLogo from '@/components/MicrosoftLogo';
import ShinyText from '@/components/ShinyText';
import BlurText from '@/components/BlurText';
import CircularGallery from '@/components/CircularGallery';
import Aurora from '@/components/Aurora';
import CallToAction from '@/components/CallToAction';
import JourneyText from '@/components/JourneyText';
import PillNav from '@/components/PillNav';
import GoalsPage from '@/components/GoalsPage';
import AboutUs from '@/components/AboutUs';
import RecentEvents from '@/components/RecentEvents';
import SponsorsPage from '@/app/sponsor/page';
import FAQ from '@/components/FAQ';
import StillHaveQuestions from '@/components/StillHaveQuestions';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('IGDTUW Animation completed!');
  };

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href') === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('click', handleAnchorClick);
    return () => window.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <>
      {/* Global Background with SVG - now sticky */}
      <div className="background-with-svg" id="top"></div>
      
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
          { label: 'Home', href: '#top' },
          { label: 'About us', href: '#about' },
          { label: 'Events', href: '#events' },
          { label: 'Blogs', href: '#blogs' },
          { label: 'Team', href: '/team' },
          { label: 'Contact us', href: '#contact' },
          { label: "Sponsors", href: "/sponsors" },
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
        {/* Microsoft Learn Student Ambassador Logo */}
        <MicrosoftLogo />

        {/* Main Title */}
        <div className="main-title">
          <ShinyText 
            text="MICROSOFT STUDENT CHAPTER" 
            speed={4}
            className="shiny-title"
          />
          <ShinyText
            text="IGDTUW"
            speed={3}
            className="subtitle"
          />
        </div>

        {/* Circular Gallery */}
        <div style={{ height: '600px', position: 'relative', width: '100%' }}>
          <CircularGallery bend={0} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} />
        </div>

        {/* Call to Action Button */}
        <CallToAction />

        {/* Journey Text */}
        <JourneyText />
      </div>

      {/* Old navbar removed in favor of sticky PillNav */}

      {/* Goals Page - appears when scrolling down */}
      <GoalsPage />

      {/* About Us Section - appears after scrolling past goals */}
      <AboutUs />

      {/* FAQ Section - appears after About Us */}
      <FAQ />

      {/* Still Have Questions Section - appears after FAQ */}
      <StillHaveQuestions />

      {/* Recent Events Section - appears after Still Have Questions */}
      <RecentEvents />

      {/* Sponsors Page Section - appears after Recent Events */}
      <SponsorsPage /> 

      {/* Footer */}
      <Footer />
    </>
  );
}

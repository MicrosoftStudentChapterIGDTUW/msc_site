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
import SponsorsPage from '@/app/sponsors/page';
import FAQ from '@/components/FAQ';
import StillHaveQuestions from '@/components/StillHaveQuestions';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

export default function Home() {
  const handleAnimationComplete = () => {
    console.log('IGDTUW Animation completed!');
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#top') {
          e.preventDefault();
          if (!isScrolling) {
            isScrolling = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { isScrolling = false; }, 1000);
          }
        } else if (href?.startsWith('#')) {
          const hash = href.substring(1);
          const element = document.getElementById(hash);
          if (element && !isScrolling) {
            e.preventDefault();
            isScrolling = true;
            requestAnimationFrame(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setTimeout(() => { isScrolling = false; }, 1000);
            });
          }
        }
      }
    };

    const handleHashScroll = () => {
      if (isScrolling) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.location.hash) {
          const hash = window.location.hash.substring(1);
          const element = document.getElementById(hash);
          if (element) {
            isScrolling = true;
            // Wait a bit longer for page to fully load when coming from other pages
            setTimeout(() => {
              requestAnimationFrame(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => { isScrolling = false; }, 1000);
              });
            }, 200);
          }
        }
      }, 100);
    };

    // Handle hash on mount (when coming from other pages)
    if (window.location.hash) {
      handleHashScroll();
    }

    window.addEventListener('click', handleAnchorClick, { passive: false });
    window.addEventListener('hashchange', handleHashScroll, { passive: true });

    return () => {
      window.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', handleHashScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <>
      {/* Background */}
      <div className="background-with-svg" id="top"></div>

      {/* Global Aurora Background - now sticky */}
      <Aurora
        colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
        blend={0.9}
        amplitude={0.9}
        speed={1}
      />

      {/* Sticky Navbar */}
      <PillNav
        logo="/logo.png"
        logoAlt="MSC Logo"
        items={[
          { label: 'Home', href: '#top' },
          { label: 'About us', href: '#about' },
          { label: 'Events', href: '/events' },
          { label: 'Blogs', href: '/blog' },
          { label: 'Team', href: '/team' },
          { label: 'Contact us', href: '#contact' },
          { label: 'Sponsors', href: '/sponsors' },
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
        
        {/* Microsoft Logo */}
        <MicrosoftLogo />

        {/* Hero Title */}
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

        {/* Gallery */}
        <div style={{ height: '600px', position: 'relative', width: '100%' }}>
          <CircularGallery bend={0} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} />
        </div>

        {/* Call to Action Button */}
        {/* <CallToAction /> */}

        {/* Journey Text */}
        <JourneyText />
      </div>

      {/* Goals */}
      <GoalsPage />

      {/* About */}
      <AboutUs />

      {/* FAQ */}
      <FAQ />

      {/* Still Have Questions */}
      <StillHaveQuestions />

      {/* Recent Events */}
      <RecentEvents />

      {/* Sponsors */}
      <SponsorsPage />

      {/* Footer */}
      <Footer />
    </>
  );
}

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import './PillNav.css';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#ffffff',
  pillColor = '#0066cc',
  hoveredPillTextColor = '#ffffff',
  pillTextColor,
  initialLoadAnimation = true
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);

  // Scroll effect for darkening navbar and top fade
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setScrollY(scrollPosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(layout, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    if ((document as any).fonts?.ready) {
      (document as any).fonts.ready.then(layout).catch(() => {});
    }

    // Only run initial animation on first page load, not on navigation
    const hasAnimated = sessionStorage.getItem('pillNavAnimated');
    const shouldAnimate = initialLoadAnimation && !hasAnimated;

    if (shouldAnimate) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease
        });
      }

      // Mark as animated so it doesn't run again during navigation
      sessionStorage.setItem('pillNavAnimated', 'true');
    } else {
      // If animation already ran, ensure elements are visible immediately
      const logo = logoRef.current;
      const navItems = navItemsRef.current;
      
      if (logo) {
        gsap.set(logo, { scale: 1 });
      }
      if (navItems) {
        gsap.set(navItems, { width: 'auto', overflow: 'visible' });
      }
    }

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimeout);
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = useCallback((i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  }, [ease]);

  const handleLeave = useCallback((i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  }, [ease]);

  const isExternalLink = useCallback((href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#'), []);

  const isRouterLink = useCallback((href?: string) => href && !isExternalLink(href), [isExternalLink]);

  const handleHashClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        e.preventDefault();
        router.push(`/${href}`);
      } else {
        e.preventDefault();
        const hash = href.substring(1);
        const element = document.getElementById(hash);
        if (element) {
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    }
  }, [pathname, router]);

  const handleLogoHover = useCallback(() => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  }, [ease]);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor
  } as React.CSSProperties;

  // Calculate fade opacity based on scroll (0 to 0.9 max)
  const fadeOpacity = Math.min(scrollY / 100, 0.9);

  return (
    <>
      {/* Scroll-based black fade at top - BELOW navbar, ABOVE content and Aurora */}
      <div 
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '180px',
          background: `linear-gradient(to bottom, rgba(0, 0, 0, ${fadeOpacity * 1.0}) 0%, rgba(0, 0, 0, ${fadeOpacity * 0.7}) 25%, rgba(0, 0, 0, ${fadeOpacity * 0.4}) 50%, rgba(0, 0, 0, ${fadeOpacity * 0.15}) 75%, transparent 100%)`,
          transition: 'opacity 0.3s ease',
          zIndex: 998
        }}
      />
      
      <div className={`pill-nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        <div className="pill-nav-content mx-auto max-w-7xl w-full flex items-center justify-center">
          <div className="pill-nav-wrapper flex items-center gap-4">
            <Link
              className="pill-logo"
              href="/"
              aria-label="Home"
              ref={el => {
                logoRef.current = el as any;
              }}
              onMouseEnter={handleLogoHover}
            >
              <img src={logo} alt={logoAlt} ref={logoImgRef} />
            </Link>

            <div className="pill-nav-items bg-black/10 backdrop-blur-md" style={{ border: '1px solid rgba(96, 165, 250, 0.3)' }} ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href} role="none">
                {isRouterLink(item.href) ? (
                  <Link
                    role="menuitem"
                    href={item.href}
                    prefetch={true}
                    className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <a
                    role="menuitem"
                    href={item.href}
                    className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    onClick={(e) => handleHashClick(e, item.href)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
    </>
  );
};

export default PillNav;



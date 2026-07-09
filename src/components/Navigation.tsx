'use client';

import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [shimmerIndex, setShimmerIndex] = useState<number | null>(null);

  const navLinks = [
    { href: '#about', label: 'ОБО МНЕ' },
    { href: '#approach', label: 'ПОДХОД' },
    { href: '#requests', label: 'С ЧЕМ КО МНЕ' },
    { href: '#articles', label: 'СТАТЬИ' },
    { href: '#tools', label: 'ИНСТРУМЕНТЫ' },
    { href: '#contacts', label: 'КОНТАКТЫ' },
  ];

  // Active Link Update on Scroll
  useEffect(() => {
    const handleScroll = () => {
      let current = '';

      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          if (center >= 0 && center <= window.innerHeight) {
            current = link.href;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Shimmer Effect logic
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextShimmer = () => {
      const delay = 8000 + Math.random() * 7000; // 8–15s
      timeoutId = setTimeout(() => {
        // Only run shimmer if user is not hovering any link
        if (hoveredIndex === null) {
          const randomIdx = Math.floor(Math.random() * navLinks.length);
          setShimmerIndex(randomIdx);
          setTimeout(() => setShimmerIndex(null), 700);
        }
        scheduleNextShimmer();
      }, delay);
    };

    scheduleNextShimmer();

    return () => clearTimeout(timeoutId);
  }, [hoveredIndex]);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('is-menu-open');
    } else {
      document.body.classList.remove('is-menu-open');
    }
    return () => document.body.classList.remove('is-menu-open');
  }, [isMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="nav">
        <a href="#hero" className="logo-link" onClick={(e) => handleLinkClick(e, '#hero')}>
          <div className="logo">
            MAESTRO<span>.</span>
          </div>
        </a>

        <button
          className={`nav-toggle ${isMenuOpen ? 'is-active' : ''}`}
          id="navToggle"
          aria-label="Меню"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-links">
          {navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              className={`shimmer-nav ${activeSection === link.href ? 'is-current' : ''} ${
                shimmerIndex === idx ? 'is-shimmer-active' : ''
              }`}
              style={{ '--i': idx } as React.CSSProperties}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`nav-menu-overlay ${isMenuOpen ? 'is-active' : ''}`} id="navMenuOverlay" onClick={() => setIsMenuOpen(false)}>
        <nav className="nav-menu-inner" onClick={(e) => e.stopPropagation()}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

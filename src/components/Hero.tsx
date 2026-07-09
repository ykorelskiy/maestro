'use client';

import { useState, useEffect, useRef } from 'react';

export default function Hero() {
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgBaseRef = useRef<HTMLDivElement>(null);
  const bgSmokeRef = useRef<HTMLDivElement>(null);

  // Parallax and Fade on Scroll
  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      if (bgBaseRef.current) {
        bgBaseRef.current.style.transform = `translateY(${scrollY * 0.15}px) scale(1.08)`;
      }
      if (bgSmokeRef.current) {
        bgSmokeRef.current.style.transform = `translateY(${scrollY * 0.35}px) scale(1.15)`;
      }
      if (heroRef.current) {
        heroRef.current.style.opacity = `${Math.max(0, 1 - scrollY / 1400)}`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Run initially

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body overflow locking for Manifest Modal
  useEffect(() => {
    if (isManifestOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isManifestOpen]);

  // Escape key handler to close Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isManifestOpen) {
        setIsManifestOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isManifestOpen]);

  const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactsSection = document.getElementById('contacts');
    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="hero" id="hero" ref={heroRef}>
        {/* BACKGROUND PARALLAX */}
        <div className="hero-background">
          <div className="bg-layer bg-base" ref={bgBaseRef}></div>
          <div className="bg-layer bg-smoke" ref={bgSmokeRef}></div>
          <div className="bg-layer bg-light"></div>
        </div>

        {/* TYPOGRAPHY BACKGROUND */}
        <div className="hero-word">CONTROL</div>

        {/* CONTENT */}
        <div className="hero-content">
          <div className="hero-label reveal active">
            ПСИХОЛОГ / СЕКСОЛОГ / BDSM-AWARE
          </div>

          <h1 className="hero-title reveal active">
            ВНУТРЕННИЙ <br />
            <span>МИР</span>
          </h1>

          <div className="hero-text reveal active">
            Работа с сексуальностью, динамикой власти, отношениями, внутренними конфликтами
            и исследованием себя.
          </div>

          <div className="hero-buttons reveal active">
            <a href="#contacts" className="btn btn-primary shimmer frame" onClick={handleBookingClick}>
              ЗАПИСАТЬСЯ
            </a>

            <a
              href="#"
              className="btn shimmer frame"
              id="manifestBtn"
              onClick={(e) => {
                e.preventDefault();
                setIsManifestOpen(true);
              }}
            >
              МАНИФЕСТ
            </a>
          </div>
        </div>

        {/* FLOATING QUOTE */}
        <div className="floating-quote reveal active shimmer">
          <p>
            Иногда человека разрушает не желание, а невозможность признать его существование.
          </p>
          <span>MAESTRO</span>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="scroll-indicator">
          <span></span>
        </div>
      </section>

      {/* TRANSITION QUOTE SECTION */}
      <section className="transition-section">
        <div className="transition-content">
          <div className="transition-line"></div>
          <h2>Психика редко говорит напрямую.</h2>
          <p>Чаще — через желания, страх, контроль, стыд и фантазии.</p>
        </div>
      </section>

      {/* MANIFEST MODAL */}
      <div
        className={`manifest-overlay ${isManifestOpen ? 'active' : ''}`}
        id="manifestOverlay"
        onClick={() => setIsManifestOpen(false)}
      >
        <div className="manifest-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="manifest-close"
            id="manifestClose"
            aria-label="Закрыть"
            onClick={() => setIsManifestOpen(false)}
          >
            ×
          </button>
          <h2>Манифест</h2>
          <p>
            Жизнь нередко ставит нас в <strong>сложные ситуации</strong> и перед{' '}
            <strong>неоднозначным выбором</strong>. А если дело касается человеческих отношений
            — и тем более сексуальных — поговорить об этом откровенно <strong>не с кем</strong>.
            Меня сложно чем-то удивить: в подобные ситуации люди уже попадали, и я помогал им{' '}
            <strong>найти выход</strong>. Я готов вместе с вами разобрать любую тему и помочь{' '}
            <strong>осознанно принять сложное решение</strong>.
          </p>
          <button
            className="manifest-confirm"
            id="manifestConfirm"
            onClick={() => setIsManifestOpen(false)}
          >
            Договорились
          </button>
        </div>
      </div>
    </>
  );
}

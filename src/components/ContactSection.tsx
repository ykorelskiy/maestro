'use client';

import { useState, useEffect, useRef } from 'react';
import BookingModal from '@/components/BookingModal';

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Split name MAESTRO.
  const nameText = 'MAESTRO.';
  const letters = nameText.split('');
  
  const vectors = [
    { x: 0, y: -90, r: -15 },
    { x: -70, y: -60, r: 25 },
    { x: 80, y: -50, r: -20 },
    { x: -40, y: 70, r: 35 },
    { x: 60, y: 65, r: -30 },
    { x: -80, y: -30, r: 20 },
    { x: 40, y: 80, r: 10 },
    { x: 0, y: 0, r: 0 },
  ];

  // Intersection Observer for Section visibility
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Scatter Animation on Hover
  const handleMouseEnter = () => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1000px)').matches;
    if (isReduced || isMobile || !nameRef.current || !cardRef.current) return;

    nameRef.current.classList.add('is-scattered');
    const spans = nameRef.current.querySelectorAll('.contacts-letter');
    const cardWidth = cardRef.current.offsetWidth || 480;
    const scale = cardWidth / 480;

    spans.forEach((span, idx) => {
      const el = span as HTMLElement;
      const v = vectors[idx] || { x: 0, y: 0, r: 0 };
      el.style.transitionDelay = `${idx * 30}ms`;
      el.style.transform = `translateX(${v.x * scale}px) translateY(${v.y * scale}px) rotate(${v.r}deg)`;
    });
  };

  const handleMouseLeave = () => {
    if (!nameRef.current) return;

    nameRef.current.classList.remove('is-scattered');
    const spans = nameRef.current.querySelectorAll('.contacts-letter');
    spans.forEach((span) => {
      const el = span as HTMLElement;
      el.style.transitionDelay = '';
      el.style.transform = '';
    });
  };

  return (
    <section id="contacts" className="contacts-section" ref={sectionRef}>
      <div className="contacts-bg-orb contacts-bg-orb--1"></div>
      <div className="contacts-bg-orb contacts-bg-orb--2"></div>

      <div className="contacts-inner">
        <div className="contacts-text-col">
          <h2 className="contacts-title">
            <span className="contacts-title-word">Связаться</span>
          </h2>
          <div className="contacts-paragraphs">
            <p className="contacts-p">
              Если вы хотите обсудить запрос, уточнить формат работы или понять, ваш ли это случай,
              — напишите мне или заполните форму записи.
            </p>
            <p className="contacts-p">
              Консультации проходят онлайн. Очные встречи возможны редко и только по предварительной
              договорённости.
            </p>
            <p className="contacts-p">
              Я отвечу честно: берусь ли я за такой запрос, в каком формате возможна работа и если нет
              — к какому специалисту лучше обратиться.
            </p>
          </div>
          <div className="contacts-response-line">
            <span className="contacts-status-dot"></span>
            <span className="contacts-response-text">Отвечаю обычно в течение 24 часов</span>
          </div>
          <div className="contacts-confidential">
            <svg
              className="contacts-lock-icon"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 7V5a2 2 0 0 1 4 0v2" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
            <span>Конфиденциально</span>
          </div>
        </div>

        <div className="contacts-cards-col">
          <div
            className="contacts-visit-card"
            id="contactsVisitCard"
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Bevel and design elements */}
            <div className="contacts-wave" aria-hidden="true"></div>
            <div className="contacts-bevel" aria-hidden="true"></div>
            <div className="contacts-grain" aria-hidden="true"></div>

            {/* Resting state content */}
            <div className="contacts-resting">
              <div className="contacts-name" ref={nameRef}>
                {letters.map((char, i) => (
                  <span
                    key={i}
                    className={`contacts-letter ${char === '.' ? 'is-dot' : ''}`}
                  >
                    {char === '.' ? '·' : char}
                  </span>
                ))}
              </div>
              <div className="contacts-icons-rest">
                <svg
                  className="contacts-icon-big"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2.5L2.5 10.5L10.5 13.5L13.5 21.5L21.5 2.5Z" />
                  <path d="M10.5 13.5L14.5 9.5" />
                </svg>
                <svg
                  className="contacts-icon-big"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
              </div>
            </div>

            {/* Hover content (Clickable links) */}
            <div className="contacts-hover-content">
              <a
                href="https://t.me/Maaeesstro"
                target="_blank"
                rel="noopener noreferrer"
                className="contacts-contact-row"
                data-row="0"
              >
                <span className="contacts-contact-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2.5L2.5 10.5L10.5 13.5L13.5 21.5L21.5 2.5Z" />
                    <path d="M10.5 13.5L14.5 9.5" />
                  </svg>
                </span>
                <span className="contacts-contact-text">@Maaeesstro</span>
              </a>
              <a
                href="mailto:maestro.fisting@gmail.com"
                className="contacts-contact-row"
                data-row="1"
              >
                <span className="contacts-contact-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                  </svg>
                </span>
                <span className="contacts-contact-text">maestro.fisting@gmail.com</span>
              </a>

              {/* Booking Form button */}
              <button
                type="button"
                className="btn btn-accent shimmer frame"
                style={{ marginTop: '24px', width: '100%', fontSize: '11px', padding: '12px 10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                ЗАПОЛНИТЬ ФОРМУ ЗАПИСИ
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

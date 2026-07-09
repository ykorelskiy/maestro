'use client';

import { useState, useEffect, useRef } from 'react';

export default function AboutStack() {
  const [activeDot, setActiveDot] = useState(1);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const cardsCount = 6;

  // Clear timer for a card
  const clearCardTimer = (idx: number) => {
    if (timersRef.current.has(idx)) {
      clearTimeout(timersRef.current.get(idx));
      timersRef.current.delete(idx);
    }
  };

  // Trigger reveal animation
  const revealCard = (cardEl: HTMLElement | null, idx: number) => {
    if (!cardEl || cardEl.hasAttribute('data-revealing')) return;

    cardEl.setAttribute('data-revealing', 'true');
    cardEl.classList.add('is-revealing');

    setTimeout(() => {
      if (cardEl) {
        cardEl.classList.remove('is-revealing');
        cardEl.removeAttribute('data-revealing');
      }
    }, 2000);
  };

  // Schedule auto reveal every 8-10 seconds
  const scheduleAutoReveal = (cardEl: HTMLElement | null, idx: number) => {
    const delay = 8000 + Math.random() * 2000;
    clearCardTimer(idx);

    const tid = setTimeout(() => {
      revealCard(cardEl, idx);
      scheduleAutoReveal(cardEl, idx);
    }, delay);

    timersRef.current.set(idx, tid);
  };

  // Set up intersection observers for reveal and active dots
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isReduced) return;

    // Observer for reveal trigger
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardEl = entry.target as HTMLElement;
          const idx = cardRefs.current.indexOf(cardEl);

          if (entry.isIntersecting) {
            if (!cardEl.hasAttribute('data-has-revealed')) {
              cardEl.setAttribute('data-has-revealed', 'true');
              revealCard(cardEl, idx);
            }

            if (!isMobile) {
              scheduleAutoReveal(cardEl, idx);
            }
          } else {
            clearCardTimer(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    cardRefs.current.forEach((card) => {
      if (card) revealObserver.observe(card);
    });

    // Observer to show/hide the dot navigation based on section visibility
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        setIsNavHidden(!visible);
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timersRef.current.forEach((val) => clearTimeout(val));
    };
  }, []);

  // Update active dot on scroll
  useEffect(() => {
    const handleScroll = () => {
      let activeIdx = 0;

      cardRefs.current.forEach((card, i) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          if (center >= 0 && center <= window.innerHeight) {
            activeIdx = i;
          }
        }
      });

      setActiveDot(activeIdx + 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide nav dots if any modal is open
  useEffect(() => {
    const toggleNavVisibility = () => {
      const hasActiveModal = document.querySelector(
        '.approach-modal-overlay.is-active, .manifest-overlay.active, .nav-menu-overlay.is-active'
      );
      setIsNavHidden(!!hasActiveModal);
    };

    const modalObserver = new MutationObserver(toggleNavVisibility);
    document.querySelectorAll('.approach-modal-overlay, .manifest-overlay, .nav-menu-overlay').forEach((el) => {
      if (el) modalObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
    });

    return () => modalObserver.disconnect();
  }, []);

  const handleDotClick = (idx: number) => {
    const targetCard = cardRefs.current[idx - 1];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      revealCard(targetCard, idx - 1);
    }
  };

  const handleMouseEnter = (idx: number) => {
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hasHover) {
      revealCard(cardRefs.current[idx], idx);
    }
  };

  return (
    <section id="about" className="about-stack" ref={sectionRef}>
      {/* CARD 1 */}
      <article
        className="about-card"
        data-card="1"
        ref={(el) => { cardRefs.current[0] = el; }}
        onMouseEnter={() => handleMouseEnter(0)}
      >
        <div className="about-card__bg"></div>
        <div className="about-card__graphic" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Staff lines */}
            <g stroke="currentColor" strokeWidth="1.2" opacity="0.2">
              <line x1="50" y1="120" x2="550" y2="120" />
              <line x1="50" y1="132" x2="550" y2="132" />
              <line x1="50" y1="144" x2="550" y2="144" />
              <line x1="50" y1="156" x2="550" y2="156" />
              <line x1="50" y1="168" x2="550" y2="168" />
            </g>

            {/* Treble Clef */}
            <path
              d="M 78 200 
                 C 74 190, 84 182, 92 182 
                 C 102 182, 108 190, 108 198 
                 C 108 210, 92 225, 80 225 
                 C 65 225, 55 210, 55 190 
                 C 55 150, 90 110, 90 80 
                 C 90 65, 82 55, 74 55 
                 C 66 55, 62 67, 66 82 
                 L 78 205 
                 C 80 217, 74 225, 66 225 
                 C 58 225, 54 217, 54 210" 
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.3"
            />

            {/* Key Signature (C minor - 3 flats) */}
            <g stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3">
              {/* B flat (y=144) */}
              <path d="M 115 125 L 115 144 A 4 4 0 0 1 121 140 C 122 137, 118 135, 115 137" />
              {/* E flat (y=126) */}
              <path d="M 125 107 L 125 126 A 4 4 0 0 1 131 122 C 132 119, 128 117, 125 119" />
              {/* A flat (y=150) */}
              <path d="M 135 131 L 135 150 A 4 4 0 0 1 141 146 C 142 143, 138 141, 135 143" />
            </g>

            {/* Time Signature (Common time C) */}
            <path
              d="M 152 135 A 8 8 0 1 0 152 151"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Melody Notes (J.S. Bach - Fugue in C minor BWV 847) */}
            <g opacity="0.35">
              {/* 1. Eighth rest */}
              <path d="M 168 142 Q 173 138, 172 144 Q 170 148, 176 142 L 170 156" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Group 1: C5, B4, C5 */}
              {/* C5 (y=138) */}
              <ellipse cx="188" cy="138" rx="5.5" ry="3.8" transform="rotate(-20 188 138)" fill="currentColor" />
              <line x1="182.8" y1="138" x2="182.8" y2="166" stroke="currentColor" strokeWidth="1.2" />
              
              {/* B4 (y=144) */}
              <ellipse cx="208" cy="144" rx="5.5" ry="3.8" transform="rotate(-20 208 144)" fill="currentColor" />
              <line x1="202.8" y1="144" x2="202.8" y2="172" stroke="currentColor" strokeWidth="1.2" />
              
              {/* C5 (y=138) */}
              <ellipse cx="228" cy="138" rx="5.5" ry="3.8" transform="rotate(-20 228 138)" fill="currentColor" />
              <line x1="222.8" y1="138" x2="222.8" y2="166" stroke="currentColor" strokeWidth="1.2" />

              {/* Group 1 Beams (sixteenth notes) */}
              <line x1="182.8" y1="166" x2="222.8" y2="166" stroke="currentColor" strokeWidth="3" />
              <line x1="182.8" y1="160" x2="222.8" y2="160" stroke="currentColor" strokeWidth="1.5" />

              {/* Group 2: G4, Ab4, F4, G4 */}
              {/* G4 (y=156) */}
              <ellipse cx="252" cy="156" rx="5.5" ry="3.8" transform="rotate(-20 252 156)" fill="currentColor" />
              <line x1="257.2" y1="156" x2="257.2" y2="128" stroke="currentColor" strokeWidth="1.2" />

              {/* Ab4 (y=150) */}
              <ellipse cx="272" cy="150" rx="5.5" ry="3.8" transform="rotate(-20 272 150)" fill="currentColor" />
              <line x1="277.2" y1="150" x2="277.2" y2="122" stroke="currentColor" strokeWidth="1.2" />

              {/* F4 (y=162) */}
              <ellipse cx="292" cy="162" rx="5.5" ry="3.8" transform="rotate(-20 292 162)" fill="currentColor" />
              <line x1="297.2" y1="162" x2="297.2" y2="134" stroke="currentColor" strokeWidth="1.2" />

              {/* G4 (y=156) */}
              <ellipse cx="312" cy="156" rx="5.5" ry="3.8" transform="rotate(-20 312 156)" fill="currentColor" />
              <line x1="317.2" y1="156" x2="317.2" y2="128" stroke="currentColor" strokeWidth="1.2" />

              {/* Group 2 Beams */}
              <line x1="257.2" y1="128" x2="317.2" y2="128" stroke="currentColor" strokeWidth="3" />
              <line x1="257.2" y1="134" x2="317.2" y2="134" stroke="currentColor" strokeWidth="1.5" />

              {/* Group 3: D4, Eb4, C4, D4 */}
              {/* D4 (y=174) */}
              <ellipse cx="336" cy="174" rx="5.5" ry="3.8" transform="rotate(-20 336 174)" fill="currentColor" />
              <line x1="341.2" y1="174" x2="341.2" y2="146" stroke="currentColor" strokeWidth="1.2" />

              {/* Eb4 (y=168) */}
              <ellipse cx="356" cy="168" rx="5.5" ry="3.8" transform="rotate(-20 356 168)" fill="currentColor" />
              <line x1="361.2" y1="168" x2="361.2" y2="140" stroke="currentColor" strokeWidth="1.2" />

              {/* C4 (y=180 + ledger line) */}
              <ellipse cx="376" cy="180" rx="5.5" ry="3.8" transform="rotate(-20 376 180)" fill="currentColor" />
              <line x1="381.2" y1="180" x2="381.2" y2="152" stroke="currentColor" strokeWidth="1.2" />
              <line x1="366" y1="180" x2="386" y2="180" stroke="currentColor" strokeWidth="1.2" />

              {/* D4 (y=174) */}
              <ellipse cx="396" cy="174" rx="5.5" ry="3.8" transform="rotate(-20 396 174)" fill="currentColor" />
              <line x1="401.2" y1="174" x2="401.2" y2="146" stroke="currentColor" strokeWidth="1.2" />

              {/* Group 3 Beams */}
              <line x1="341.2" y1="146" x2="401.2" y2="146" stroke="currentColor" strokeWidth="3" />
              <line x1="341.2" y1="152" x2="401.2" y2="152" stroke="currentColor" strokeWidth="1.5" />

              {/* Group 4: G4, C4, B3, C4 */}
              {/* G4 (y=156) */}
              <ellipse cx="420" cy="156" rx="5.5" ry="3.8" transform="rotate(-20 420 156)" fill="currentColor" />
              <line x1="425.2" y1="156" x2="425.2" y2="128" stroke="currentColor" strokeWidth="1.2" />

              {/* C4 (y=180 + ledger line) */}
              <ellipse cx="440" cy="180" rx="5.5" ry="3.8" transform="rotate(-20 440 180)" fill="currentColor" />
              <line x1="445.2" y1="180" x2="445.2" y2="138" stroke="currentColor" strokeWidth="1.2" />
              <line x1="430" y1="180" x2="450" y2="180" stroke="currentColor" strokeWidth="1.2" />

              {/* B3 (y=186 + ledger line space) */}
              <ellipse cx="460" cy="186" rx="5.5" ry="3.8" transform="rotate(-20 460 186)" fill="currentColor" />
              <line x1="465.2" y1="186" x2="465.2" y2="144" stroke="currentColor" strokeWidth="1.2" />
              <line x1="450" y1="180" x2="470" y2="180" stroke="currentColor" strokeWidth="1.2" />

              {/* C4 (y=180 + ledger line) */}
              <ellipse cx="480" cy="180" rx="5.5" ry="3.8" transform="rotate(-20 480 180)" fill="currentColor" />
              <line x1="485.2" y1="180" x2="485.2" y2="152" stroke="currentColor" strokeWidth="1.2" />
              <line x1="470" y1="180" x2="490" y2="180" stroke="currentColor" strokeWidth="1.2" />

              {/* Group 4 Beams (slanted) */}
              <line x1="425.2" y1="128" x2="485.2" y2="152" stroke="currentColor" strokeWidth="3" />
              <line x1="425.2" y1="134" x2="485.2" y2="158" stroke="currentColor" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
        <div className="about-card__content">
          <p>Меня знают под именем <strong>Маэстро</strong> — уже больше двадцати лет.</p>
          <p>Имя пришло из простой мысли: нижняя — это инструмент, верхний — музыкант. И от музыканта зависит, прозвучит ли из инструмента прекрасная мелодия — или какофония.</p>
        </div>
      </article>

      {/* CARD 2 */}
      <article
        className="about-card"
        data-card="2"
        ref={(el) => { cardRefs.current[1] = el; }}
        onMouseEnter={() => handleMouseEnter(1)}
      >
        <div className="about-card__graphic" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.3" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Baseline */}
              <line x1="40" y1="340" x2="560" y2="340" strokeWidth="1.5" opacity="0.4" />

              {/* Water waves */}
              <path d="M 50 352 L 550 352" strokeWidth="0.8" opacity="0.15" />
              <path d="M 70 362 Q 120 360 170 362 T 270 362 T 370 362 T 470 362 T 530 362" strokeWidth="0.8" opacity="0.1" />

              {/* 1. Rostral Column (x: 60 - 110) */}
              <path d="M 65 340 L 95 340 L 95 330 L 90 330 L 90 200 C 90 190, 88 185, 80 185 C 72 185, 70 190, 70 200 L 70 330 L 65 330 Z" strokeWidth="1.5" />
              {/* Rostra Left 1 */}
              <path d="M 70 280 C 60 278, 55 268, 50 272 C 55 278, 65 284, 70 284" strokeWidth="1.2" />
              {/* Rostra Right 1 */}
              <path d="M 90 280 C 100 278, 105 268, 110 272 C 105 278, 95 284, 90 284" strokeWidth="1.2" />
              {/* Rostra Left 2 */}
              <path d="M 70 240 C 62 238, 57 230, 53 234 C 57 240, 67 244, 70 244" strokeWidth="1.2" />
              {/* Rostra Right 2 */}
              <path d="M 90 240 C 98 238, 103 230, 107 234 C 103 240, 93 244, 90 244" strokeWidth="1.2" />
              {/* Torch Bowl */}
              <path d="M 72 185 L 88 185 L 92 175 L 68 175 Z" strokeWidth="1.5" />
              {/* Flame */}
              <path d="M 74 175 Q 76 158 80 160 Q 84 158 86 175" strokeWidth="1.2" />

              {/* 2. St. Isaac's Cathedral (x: 135 - 245) */}
              <path d="M 135 340 L 245 340 L 245 315 L 225 315 L 225 300 L 155 300 L 155 315 L 135 315 Z" strokeWidth="1.5" />
              {/* Columns */}
              <line x1="165" y1="315" x2="165" y2="340" strokeWidth="1.2" />
              <line x1="177" y1="315" x2="177" y2="340" strokeWidth="1.2" />
              <line x1="189" y1="315" x2="189" y2="340" strokeWidth="1.2" />
              <line x1="201" y1="315" x2="201" y2="340" strokeWidth="1.2" />
              <line x1="213" y1="315" x2="213" y2="340" strokeWidth="1.2" />
              {/* Pediment Triangle */}
              <path d="M 150 300 L 190 280 L 230 300 Z" strokeWidth="1.5" />
              {/* Dome Drum */}
              <path d="M 165 280 L 215 280 L 215 250 L 165 250 Z" strokeWidth="1.2" />
              <line x1="175" y1="250" x2="175" y2="280" strokeWidth="1" />
              <line x1="185" y1="250" x2="185" y2="280" strokeWidth="1" />
              <line x1="195" y1="250" x2="195" y2="280" strokeWidth="1" />
              <line x1="205" y1="250" x2="205" y2="280" strokeWidth="1" />
              {/* Dome */}
              <path d="M 167 250 C 167 195, 213 195, 213 250" strokeWidth="2" />
              {/* Top Lantern */}
              <path d="M 184 198 L 196 198 L 196 182 L 184 182 Z" strokeWidth="1.2" />
              <path d="M 186 182 Q 190 172 194 182" strokeWidth="1.2" />
              {/* Cross */}
              <line x1="190" y1="172" x2="190" y2="162" strokeWidth="1.5" />
              <line x1="186" y1="166" x2="194" y2="166" strokeWidth="1.2" />

              {/* 3. Peter and Paul Cathedral (x: 270 - 360) */}
              <path d="M 270 340 L 360 340 L 360 310 L 340 310 L 340 280 L 280 280 L 280 310 L 270 310 Z" strokeWidth="1.5" />
              {/* Tower levels */}
              <path d="M 292 280 L 328 280 L 328 240 L 292 240 Z" strokeWidth="1.2" />
              <path d="M 298 240 L 322 240 L 322 205 L 298 205 Z" strokeWidth="1.2" />
              <path d="M 302 205 C 302 195, 318 195, 318 205 Z" strokeWidth="1.2" />
              {/* Spire */}
              <line x1="310" y1="190" x2="310" y2="70" strokeWidth="2.2" />
              {/* Cross & Angel */}
              <line x1="310" y1="70" x2="310" y2="55" strokeWidth="1.2" />
              <line x1="306" y1="62" x2="314" y2="62" strokeWidth="1.2" />
              <path d="M 310 62 C 314 62, 317 58, 317 62" strokeWidth="1" />

              {/* 4. Palace Bridge (x: 390 - 550) */}
              {/* Left Pier */}
              <path d="M 370 340 L 395 330 L 395 340 Z" strokeWidth="1.5" />
              {/* Right Pier */}
              <path d="M 550 340 L 525 330 L 525 340 Z" strokeWidth="1.5" />
              {/* Left Wing (slanted up-right) */}
              <line x1="395" y1="330" x2="450" y2="190" strokeWidth="2.2" />
              <path d="M 395 330 Q 425 260 440 200" strokeWidth="1.2" />
              {/* Left wing lattice members */}
              <line x1="405" y1="305" x2="413" y2="280" strokeWidth="0.8" />
              <line x1="415" y1="280" x2="423" y2="255" strokeWidth="0.8" />
              <line x1="425" y1="255" x2="433" y2="230" strokeWidth="0.8" />
              <line x1="435" y1="230" x2="443" y2="205" strokeWidth="0.8" />
              
              {/* Right Wing (slanted up-left) */}
              <line x1="525" y1="330" x2="470" y2="190" strokeWidth="2.2" />
              <path d="M 525 330 Q 495 260 480 200" strokeWidth="1.2" />
              {/* Right wing lattice members */}
              <line x1="515" y1="305" x2="507" y2="280" strokeWidth="0.8" />
              <line x1="505" y1="280" x2="497" y2="255" strokeWidth="0.8" />
              <line x1="495" y1="255" x2="487" y2="230" strokeWidth="0.8" />
              <line x1="485" y1="230" x2="477" y2="205" strokeWidth="0.8" />
            </g>
          </svg>
        </div>
        <div className="about-card__content">
          <p>Днём — Петербург, кабинет, люди, решения, тяжесть чужих ошибок на собственных плечах. Ночью — другое. То, ради чего сделан этот сайт.</p>
          <p>И помимо доминирования у меня есть другая работа — работа <strong>проводника</strong>. Я помогаю найти себя. Найти дорогу — либо к себе, либо к согласию с собой. Сто нижних личностей воспитать я не могу: на это не хватит ни меня, ни жизни. А сказать нужное слово, дать опору, поставить в ситуацию, в которой человек увидит себя яснее, — могу. Для этого и сделан этот сайт.</p>
        </div>
      </article>

      {/* CARD 3 */}
      <article
        className="about-card"
        data-card="3"
        ref={(el) => { cardRefs.current[2] = el; }}
        onMouseEnter={() => handleMouseEnter(2)}
      >
        <div className="about-card__bg"></div>
        <div className="about-card__graphic" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.3" stroke="currentColor" strokeLinecap="round">
              <line x1="120" y1="100" x2="480" y2="100" strokeWidth="1.2" opacity="0.4" />
              <line x1="100" y1="130" x2="500" y2="130" strokeWidth="1.2" opacity="0.4" />
              <rect x="90" y="155" width="420" height="6" rx="1" fill="currentColor" opacity="0.5" />
              <line x1="95" y1="158" x2="505" y2="158" strokeWidth="1.5" opacity="0.25" />
              <line x1="100" y1="170" x2="490" y2="170" strokeWidth="1.2" opacity="0.4" />
              <line x1="110" y1="200" x2="470" y2="200" strokeWidth="1.2" opacity="0.4" />
              <line x1="90" y1="230" x2="510" y2="230" strokeWidth="1.2" opacity="0.4" />
              <rect x="95" y="255" width="390" height="6" rx="1" fill="currentColor" opacity="0.5" />
              <line x1="100" y1="258" x2="480" y2="258" strokeWidth="1.5" opacity="0.25" />
              <line x1="105" y1="280" x2="485" y2="280" strokeWidth="1.2" opacity="0.4" />
              <line x1="130" y1="310" x2="450" y2="310" strokeWidth="1.2" opacity="0.4" />
            </g>
          </svg>
        </div>
        <div className="about-card__content">
          <p>В конце нулевых, когда тема в русском интернете ещё только начинала появляться, я написал заметку — «10 мифов о фистинге». Тогда казалось — короткий текст, для своих. Получилось иначе: заметку растащили по площадкам, по форумам, по личным сайтам. Тогда я вёл активную социальную жизнь и общался на разных площадках — где впоследствии был заблокирован. Но привычка осталась — объяснять то, что объяснять не принято.</p>
        </div>
      </article>

      {/* CARD 4 */}
      <article
        className="about-card"
        data-card="4"
        ref={(el) => { cardRefs.current[3] = el; }}
        onMouseEnter={() => handleMouseEnter(3)}
      >
        <div className="about-card__bg"></div>
        <div className="about-card__graphic" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <g className="about-symbol about-symbol--1">
                <path d="M130 120 Q150 100 170 130 Q190 160 200 180 Q210 200 190 230 Q170 260 160 280 Q150 300 160 310" strokeWidth="2.5" />
                <text x="90" y="230" fontFamily="serif" fontSize="14" fill="currentColor" stroke="none" opacity="0.5">E=mc²</text>
                <text x="210" y="270" fontFamily="serif" fontSize="12" fill="currentColor" stroke="none" opacity="0.4">∫</text>
              </g>
              <g className="about-symbol about-symbol--2">
                <rect x="265" y="130" width="10" height="150" opacity="0.8" />
                <rect x="255" y="280" width="30" height="6" rx="1" opacity="0.8" />
                <rect x="258" y="276" width="24" height="4" rx="1" opacity="0.8" />
                <path d="M250 130 Q260 110 270 130 Q280 110 290 130" strokeWidth="2" />
                <path d="M252 136 Q262 120 270 136 Q278 120 288 136" strokeWidth="1.5" />
                <line x1="268" y1="140" x2="268" y2="275" strokeWidth="0.6" opacity="0.4" />
                <line x1="272" y1="140" x2="272" y2="275" strokeWidth="0.6" opacity="0.4" />
              </g>
              <g className="about-symbol about-symbol--3">
                <path d="M420 300 C420 280 430 260 440 250 C450 240 455 230 450 220 C445 210 430 205 420 210 C410 215 405 230 410 240 C415 250 410 255 400 260 C390 265 390 275 395 280 C400 285 400 295 400 300" strokeWidth="2" />
              </g>
            </g>
          </svg>
        </div>
        <div className="about-card__content">
          <p>Образование дало мне три опоры. Математика — чёткость структуры и логику. Философия — широту: благодаря ей я могу видеть людей, которые на меня совсем не похожи, и тех, кто мне внутренне чужд, не сводя их к ярлыку. Психология — это про взаимодействие: и мыслей внутри одной головы, и людей друг с другом. Без неё всё остальное остаётся теорией.</p>
          <p>И двадцать с лишним лет в самой теме — достаточный срок, чтобы набраться опыта и уверенности в своих силах.</p>
        </div>
      </article>

      {/* CARD 5 */}
      <article
        className="about-card"
        data-card="5"
        ref={(el) => { cardRefs.current[4] = el; }}
        onMouseEnter={() => handleMouseEnter(4)}
      >
        <div className="about-card__bg"></div>
        <div className="about-card__content about-card__content--center">
          <p className="about-quote"><span className="text-accent">«</span>Не навреди<span className="text-accent">»</span>.</p>
          <p className="about-quote"><span className="text-accent">«</span>Мы в ответе за тех, кого приручили<span className="text-accent">»</span>.</p>
        </div>
      </article>

      {/* CARD 6 */}
      <article
        className="about-card"
        data-card="6"
        ref={(el) => { cardRefs.current[5] = el; }}
        onMouseEnter={() => handleMouseEnter(5)}
      >
        <div className="about-card__bg"></div>
        <div className="about-card__graphic" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M80 200 C100 180 120 190 140 210 C150 220 160 235 170 240 C180 245 185 240 190 230 C195 220 190 205 200 195 C210 185 225 190 230 200 C235 210 225 225 220 235 C215 245 220 255 230 260 C240 265 250 255 250 245 C250 235 245 225 255 215 C265 205 280 210 280 220" />
              <path d="M520 200 C500 180 480 190 460 210 C450 220 440 235 430 240 C420 245 415 240 410 230 C405 220 410 205 400 195 C390 185 375 190 370 200 C365 210 375 225 380 235 C385 245 380 255 370 260 C360 265 350 255 350 245 C350 235 355 225 345 215 C335 205 320 210 320 220" />
            </g>
          </svg>
        </div>
        <div className="about-card__content">
          <p>Со мной выходят на контакт по-разному. Кто-то приходит за разговором — разобраться в себе, в желаниях, в том, что мешает или зовёт. Это разговор без оценок и без снисхождения.</p>
          <p>Сексуальные отношения — это другое. Это не разговор и не консультация, это тонкий психофизиологический контакт. И поэтому здесь — только женщины.</p>
          <p>При этом я не клинический психолог и не врач. Не ставлю диагнозов, не выписываю рецептов, не лечу. Если речь о травме, о психиатрии, о теле, которому нужна медицина, — это не сюда, и я первый об этом скажу.</p>
        </div>
      </article>

      {/* Navigation Dots */}
      <nav
        className={`about-nav ${isNavHidden ? 'is-hidden' : ''}`}
        id="aboutNav"
        aria-label="Секции обо мне"
      >
        {Array.from({ length: cardsCount }).map((_, i) => (
          <button
            key={i}
            className={`about-nav__dot ${activeDot === i + 1 ? 'is-active' : ''}`}
            data-target={i + 1}
            aria-label={`Плашка ${i + 1}`}
            onClick={() => handleDotClick(i + 1)}
          ></button>
        ))}
      </nav>
    </section>
  );
}

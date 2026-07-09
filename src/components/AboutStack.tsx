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
            <line x1="80" y1="120" x2="520" y2="110" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <line x1="80" y1="150" x2="520" y2="140" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <line x1="80" y1="180" x2="520" y2="170" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <line x1="80" y1="210" x2="520" y2="200" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <line x1="80" y1="240" x2="520" y2="230" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <path
              d="M130 120 C130 80 170 60 190 90 C210 120 180 180 160 200 C140 220 120 200 130 180 C140 160 160 170 155 190 C150 210 140 230 145 245 C150 260 165 255 170 240 C175 225 165 210 155 215 C145 220 140 210 145 200"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <g opacity="0.3">
              <ellipse cx="260" cy="165" rx="10" ry="7" transform="rotate(-15 260 165)" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <line x1="270" y1="165" x2="270" y2="110" stroke="currentColor" strokeWidth="1.2" />
              <ellipse cx="340" cy="195" rx="10" ry="7" transform="rotate(-15 340 195)" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <line x1="350" y1="195" x2="350" y2="140" stroke="currentColor" strokeWidth="1.2" />
              <ellipse cx="410" cy="155" rx="10" ry="7" transform="rotate(-15 410 155)" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <line x1="420" y1="155" x2="420" y2="100" stroke="currentColor" strokeWidth="1.2" />
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
        <div className="about-card__bg"></div>
        <div className="about-card__graphic" aria-hidden="true">
          <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M120 350 L120 280 L130 280 L130 270 L140 270 L140 260 L145 220 L145 260 L150 260 L150 270 L160 270 L160 280 L170 280 L170 350" />
              <path d="M145 220 L145 200 L150 200 L150 220" />
              <path d="M270 350 L270 300 L280 300 L280 280 L290 280 Q300 260 310 280 L320 280 L320 300 L330 300 L330 350" />
              <path d="M295 270 Q300 250 305 270" />
              <path d="M300 250 L300 240" />
              <path d="M440 350 L440 320 L450 320 L450 310 L460 310 L460 300 L465 270 L465 300 L475 300 L475 310 L485 310 L485 320 L495 320 L495 350" />
              <path d="M465 270 L465 260 L470 260 L470 270" />
              <path d="M50 350 L50 340 L100 340 L100 330 L200 330 L200 340 L230 340 L230 330 L370 330 L370 340 L400 340 L400 330 L530 330 L530 340 L550 340 L550 350" strokeWidth="1" opacity="0.4" />
              <path d="M50 360 L550 360" strokeWidth="0.8" opacity="0.15" />
              <path d="M50 370 L550 370" strokeWidth="0.8" opacity="0.1" />
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

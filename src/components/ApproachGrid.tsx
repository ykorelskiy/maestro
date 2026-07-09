'use client';

import { useState, useEffect, useRef } from 'react';

interface CardData {
  num: string;
  title: string;
  html: string;
}

export default function ApproachGrid() {
  const [activeModalCard, setActiveModalCard] = useState<CardData | null>(null);
  const [viewedTiles, setViewedTiles] = useState<boolean[]>(Array(6).fill(false));
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const cards: CardData[] = [
    {
      num: '01',
      title: 'Без морализаторства',
      html: '<p>Я не работаю из позиции «нормально» или «ненормально». Меня интересует другое: что именно происходит, почему это важно для человека, какую функцию выполняет <span class="text-accent">желание</span> и к каким последствиям может привести действие.</p>'
    },
    {
      num: '02',
      title: 'Структура вместо хаоса',
      html: '<p>В сложных темах почти всегда есть место, где что-то не сходится. Противоречие, повторяющийся сценарий, внутренний запрет, неосознанная выгода, <span class="text-accent">страх</span> или <span class="text-accent">стыд</span>. Обычно именно там находится точка входа.</p>'
    },
    {
      num: '03',
      title: 'Сексуальность как часть психики',
      html: '<p>Сексуальность не существует отдельно от личности. В ней проявляются <span class="text-accent">власть</span>, уязвимость, потребность в признании, <span class="text-accent">страх близости</span>, <span class="text-accent">желание контроля</span>, опыт боли и способы защиты.</p>'
    },
    {
      num: '04',
      title: 'Честный разговор',
      html: '<p>Со мной можно <span class="text-white">говорить прямо</span>. Без необходимости подбирать «приличные» формулировки и объяснять, почему тема вообще имеет значение. Если это важно для вас — этого достаточно, чтобы об этом говорить.</p>'
    },
    {
      num: '05',
      title: 'Ответственность за <span class="text-white">выбор</span>',
      html: '<p>Я не уговариваю, не спасаю и не решаю за человека. Моя задача — помочь увидеть структуру ситуации, возможные последствия и цену каждого варианта. <span class="text-accent">Выбор остаётся за вами.</span></p>'
    },
    {
      num: '06',
      title: 'Конфиденциальность',
      html: '<p>Всё, о чём мы говорим, остаётся между нами. <span class="text-white">Фантазии, желания, сомнения, стыд, страхи</span> и сложные мысли — это материал нашей работы, а не повод для оценки.</p><p>Я не адвокат и не врач, поэтому не могу обещать адвокатскую или врачебную тайну. Но я понимаю <span class="text-accent">ответственность за конфиденциальность</span> и отношусь к ней серьёзно.</p>'
    }
  ];

  // Load viewed tiles from sessionStorage on mount
  useEffect(() => {
    const updated = Array(6).fill(false);
    for (let i = 0; i < 6; i++) {
      if (sessionStorage.getItem('approach_viewed_' + i) === 'true') {
        updated[i] = true;
      }
    }
    setViewedTiles(updated);
  }, []);

  // Intersection Observer for grid reveal
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let hasRevealed = false;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useSimpleAnim = isMobile || isReduced;

    const getGridCenter = () => {
      const rect = grid.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const getTileCenter = (el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const revealTiles = () => {
      if (hasRevealed) return;
      hasRevealed = true;

      if (useSimpleAnim) {
        tileRefs.current.forEach((tile, i) => {
          if (!tile) return;
          const row = Math.floor(i / 2);
          setTimeout(() => {
            tile.classList.add('is-visible');
          }, row * 150);
        });
        return;
      }

      // Deck to grid animation
      const center = getGridCenter();
      tileRefs.current.forEach((tile) => {
        if (!tile) return;
        tile.classList.add('is-animating');
        const ownCenter = getTileCenter(tile);
        const dx = center.x - ownCenter.x;
        const dy = center.y - ownCenter.y;
        tile.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
        tile.style.opacity = '0';
      });

      setTimeout(() => {
        tileRefs.current.forEach((tile, i) => {
          if (!tile) return;
          setTimeout(() => {
            tile.style.transform = '';
            tile.style.opacity = '';
            tile.classList.remove('is-animating');
            tile.classList.add('is-visible');
          }, i * 120);
        });
      }, 300);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRevealed) {
            revealTiles();
            revealObserver.unobserve(grid);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealObserver.observe(grid);

    // Backup trigger if already visible
    const backupTimeout = setTimeout(() => {
      if (!hasRevealed) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          revealTiles();
          revealObserver.unobserve(grid);
        }
      }
    }, 200);

    return () => {
      revealObserver.disconnect();
      clearTimeout(backupTimeout);
    };
  }, []);

  // Modal key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalCard) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalCard]);

  // Utility to create and animate flash
  const playFlash = (cx: number, cy: number) => {
    const flash = document.createElement('div');
    flash.className = 'approach-flash';
    const size = 200;
    flash.style.left = `${cx - size / 2}px`;
    flash.style.top = `${cy - size / 2}px`;
    flash.style.width = `${size}px`;
    flash.style.height = `${size}px`;
    document.body.appendChild(flash);

    return flash.animate(
      [
        { opacity: 0, transform: 'scale(0.3)' },
        { opacity: 1, transform: 'scale(1.2)', offset: 0.4 },
        { opacity: 0, transform: 'scale(1.5)' }
      ],
      { duration: 250, easing: 'ease-out', fill: 'forwards' }
    ).finished.then(() => {
      flash.remove();
    });
  };

  const getGridAndTileCenters = () => {
    const grid = gridRef.current;
    if (!grid) return null;
    const rect = grid.getBoundingClientRect();
    const gridCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    const tileCenters = tileRefs.current.map((t) => {
      if (!t) return { x: 0, y: 0 };
      const r = t.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    return { gridCenter, tileCenters };
  };

  const openModal = (idx: number) => {
    if (animatingRef.current || activeModalCard) return;
    animatingRef.current = true;

    // Save as viewed
    const updatedViewed = [...viewedTiles];
    updatedViewed[idx] = true;
    setViewedTiles(updatedViewed);
    sessionStorage.setItem('approach_viewed_' + idx, 'true');

    // Body scroll lock
    document.body.style.overflow = 'hidden';

    const card = cards[idx];
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useSimpleAnim = isMobile || isReduced;

    if (useSimpleAnim) {
      setActiveModalCard(card);
      setTimeout(() => {
        if (overlayRef.current && modalRef.current) {
          overlayRef.current.classList.add('is-active');
          modalRef.current.animate(
            [
              { transform: 'scale(0.95)', opacity: 0 },
              { transform: 'scale(1)', opacity: 1 }
            ],
            { duration: 550, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
          ).finished.then(() => {
            animatingRef.current = false;
          });
        }
      }, 50);
      return;
    }

    // Full Deck animation
    const centers = getGridAndTileCenters();
    if (!centers) return;

    const { gridCenter, tileCenters } = centers;

    // 1. Gather all tiles to center
    const anims = tileRefs.current.map((tile, i) => {
      if (!tile) return Promise.resolve();
      const ownCenter = tileCenters[i];
      const dx = gridCenter.x - ownCenter.x;
      const dy = gridCenter.y - ownCenter.y;
      const stackOffsetX = (i - 2.5) * 3;
      const stackOffsetY = (i - 2.5) * 2;
      const stackRotate = (i - 2.5) * 1.5;

      tile.classList.add('is-animating');
      return tile.animate(
        [
          { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx + stackOffsetX}px, ${dy + stackOffsetY}px) scale(0.6) rotate(${stackRotate}deg)`, opacity: 0.9 }
        ],
        { duration: 950, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
      ).finished;
    });

    Promise.all(anims).then(() => {
      // Pin inline transforms to keep them centered
      tileRefs.current.forEach((t, i) => {
        if (!t) return;
        t.style.opacity = '1';
        const cs = getComputedStyle(t);
        t.style.transform = cs.transform;
      });

      // 2. Play flash
      playFlash(gridCenter.x, gridCenter.y).then(() => {
        // 3. Open modal
        setActiveModalCard(card);
        setTimeout(() => {
          if (overlayRef.current && modalRef.current) {
            overlayRef.current.classList.add('is-active');
            modalRef.current.animate(
              [
                { transform: 'scale(0.95)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
              ],
              { duration: 550, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
            ).finished.then(() => {
              if (modalRef.current) modalRef.current.style.transform = '';
              animatingRef.current = false;
            });
          }
        }, 50);
      });
    });
  };

  const closeModal = () => {
    if (animatingRef.current || !activeModalCard) return;
    animatingRef.current = true;

    // Body scroll unlock
    document.body.style.overflow = '';

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useSimpleAnim = isMobile || isReduced;

    if (!modalRef.current || !overlayRef.current) return;

    modalRef.current.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.95)', opacity: 0 }
      ],
      { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    ).finished.then(() => {
      if (overlayRef.current) overlayRef.current.classList.remove('is-active');
      setActiveModalCard(null);

      if (useSimpleAnim) {
        animatingRef.current = false;
        return;
      }

      // Restore tiles from center deck to grid positions
      const centers = getGridAndTileCenters();
      if (!centers) {
        animatingRef.current = false;
        return;
      }
      const { gridCenter, tileCenters } = centers;

      tileRefs.current.forEach((t) => {
        if (!t) return;
        t.getAnimations().forEach((anim) => anim.cancel());
        t.style.opacity = '0';
        t.style.transform = 'none';
        t.classList.add('is-animating');
        t.classList.remove('is-visible');
      });

      tileRefs.current.forEach((t, i) => {
        if (!t) return;
        const ownCenter = tileCenters[i];
        const dx = gridCenter.x - ownCenter.x;
        const dy = gridCenter.y - ownCenter.y;

        setTimeout(() => {
          t.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
          t.style.opacity = '0.9';

          requestAnimationFrame(() => {
            t.animate(
              [
                { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0.9 },
                { transform: 'translate(0, 0) scale(1)', opacity: 1 }
              ],
              { duration: 400, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
            ).finished.then(() => {
              t.style.transform = '';
              t.style.opacity = '';
              t.classList.remove('is-animating');
              t.classList.add('is-visible');
            });
          });
        }, i * 80);
      });

      const totalDuration = 6 * 80 + 450;
      setTimeout(() => {
        animatingRef.current = false;
      }, totalDuration);
    });
  };

  return (
    <section id="approach">
      <div className="section-container">
        <h2>Мой подход</h2>
      </div>

      <div className="approach-grid" id="approachGrid" ref={gridRef}>
        {cards.map((card, i) => (
          <div
            key={i}
            className={`approach-tile ${viewedTiles[i] ? 'is-viewed' : ''}`}
            data-index={i}
            ref={(el) => { tileRefs.current[i] = el; }}
            onClick={() => openModal(i)}
          >
            <span className="approach-number">{card.num}</span>
            <h3 dangerouslySetInnerHTML={{ __html: card.title }} />
            <span className="approach-tile-hint">Нажмите, чтобы прочитать</span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <div
        className="approach-modal-overlay"
        id="approachModalOverlay"
        ref={overlayRef}
        onClick={closeModal}
      >
        {activeModalCard && (
          <div className="approach-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <button
              className="approach-modal-close"
              id="approachModalClose"
              aria-label="Закрыть"
              onClick={closeModal}
            >
              ×
            </button>
            <span className="approach-modal-number" id="approachModalNumber">
              {activeModalCard.num}
            </span>
            <h3 id="approachModalTitle">{activeModalCard.title.replace(/<[^>]*>/g, '')}</h3>
            <div
              className="approach-modal-body"
              id="approachModalBody"
              dangerouslySetInnerHTML={{ __html: activeModalCard.html }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

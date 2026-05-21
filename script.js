/* ========================================
   SCROLL ENGINE (rafScroll)
   Единая точка подписки на scroll-события.
   ======================================== */

const rafScroll = (() => {
  const subscribers = [];
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        subscribers.forEach(fn => fn(y));
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  return {
    subscribe(fn) {
      if (typeof fn !== 'function') return;
      subscribers.push(fn);
      fn(window.scrollY);
    }
  };
})();

/* =========================================
   NAV SHIMMER — случайная волна по пунктам меню
========================================= */

(function(){
    const navLinks = document.querySelectorAll('.nav-links a');
    if(!navLinks.length) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let currentShimmerTimeout = null;
    let isHovering = false;

    // Добавляем класс shimmer-nav + устанавливаем stagger-индекс для линии
    navLinks.forEach((link, i) => {
        link.classList.add('shimmer-nav');
        link.style.setProperty('--i', i);
    });

    // Отслеживаем hover на любом пункте
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => { isHovering = true; });
        link.addEventListener('mouseleave', () => { isHovering = false; });
    });

    function scheduleShimmer(){
        const delay = 8000 + Math.random() * 7000; // 8–15 секунд
        currentShimmerTimeout = setTimeout(() => {
            if(!isHovering){
                const idx = Math.floor(Math.random() * navLinks.length);
                const link = navLinks[idx];
                link.classList.add('is-shimmer-active');
                setTimeout(() => {
                    link.classList.remove('is-shimmer-active');
                }, 700);
            }
            scheduleShimmer();
        }, delay);
    }

    scheduleShimmer();
})();

/* =========================================
   REVEAL ON SCROLL
========================================= */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add('active');

        }

    });

},{
    threshold:0.2
});

revealElements.forEach(el => {

    revealObserver.observe(el);

});

/* =========================================
   PARALLAX
========================================= */

const bgBase = document.querySelector('.bg-base');
const bgSmoke = document.querySelector('.bg-smoke');

rafScroll.subscribe((scrollY) => {

    bgBase.style.transform =
    `translateY(${scrollY * 0.15}px) scale(1.08)`;

    bgSmoke.style.transform =
    `translateY(${scrollY * 0.35}px) scale(1.15)`;

});

/* =========================================
   HERO FADE
========================================= */

const hero = document.querySelector('.hero');

rafScroll.subscribe((scrollY) => {

    hero.style.opacity =
    1 - scrollY / 1400;

});

/* ========================================
   MANIFEST MODAL
   ======================================== */

    (function() {
        const btn = document.getElementById('manifestBtn');
        const overlay = document.getElementById('manifestOverlay');
        const closeBtn = document.getElementById('manifestClose');
        const confirmBtn = document.getElementById('manifestConfirm');

        function openManifest(e) {
            if (e) e.preventDefault();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeManifest() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        btn.addEventListener('click', openManifest);
        closeBtn.addEventListener('click', closeManifest);
        confirmBtn.addEventListener('click', closeManifest);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeManifest();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                closeManifest();
            }
        });
    })();

/* =========================================
    APPROACH GRID — плитки + модалка + анимации колоды
========================================= */

(function(){
    const grid = document.getElementById('approachGrid');
    const overlay = document.getElementById('approachModalOverlay');
    const modalClose = document.getElementById('approachModalClose');
    const modalNumber = document.getElementById('approachModalNumber');
    const modalTitle = document.getElementById('approachModalTitle');
    const modalBody = document.getElementById('approachModalBody');
    if(!grid || !overlay || !modalClose) return;

    // Данные карточек
    const cards = [
        {
            num: '01',
            title: 'Без морализаторства',
            html: `<p>Я не работаю из позиции «нормально» или «ненормально». Меня интересует другое: что именно происходит, почему это важно для человека, какую функцию выполняет <span class="text-accent">желание</span> и к каким последствиям может привести действие.</p>`
        },
        {
            num: '02',
            title: 'Структура вместо хаоса',
            html: `<p>В сложных темах почти всегда есть место, где что-то не сходится. Противоречие, повторяющийся сценарий, внутренний запрет, неосознанная выгода, <span class="text-accent">страх</span> или <span class="text-accent">стыд</span>. Обычно именно там находится точка входа.</p>`
        },
        {
            num: '03',
            title: 'Сексуальность как часть психики',
            html: `<p>Сексуальность не существует отдельно от личности. В ней проявляются <span class="text-accent">власть</span>, уязвимость, потребность в признании, <span class="text-accent">страх близости</span>, <span class="text-accent">желание контроля</span>, опыт боли и способы защиты.</p>`
        },
        {
            num: '04',
            title: 'Честный разговор',
            html: `<p>Со мной можно <span class="text-white">говорить прямо</span>. Без необходимости подбирать «приличные» формулировки и объяснять, почему тема вообще имеет значение. Если это важно для вас — этого достаточно, чтобы об этом говорить.</p>`
        },
        {
            num: '05',
            title: 'Ответственность за <span class="text-accent">выбор</span>',
            html: `<p>Я не уговариваю, не спасаю и не решаю за человека. Моя задача — помочь увидеть структуру ситуации, возможные последствия и цену каждого варианта. <span class="text-accent">Выбор остаётся за вами.</span></p>`
        },
        {
            num: '06',
            title: 'Конфиденциальность',
            html: `<p>Всё, о чём мы говорим, остаётся между нами. <span class="text-white">Фантазии, желания, сомнения, стыд, страхи</span> и сложные мысли — это материал нашей работы, а не повод для оценки.</p><p>Я не адвокат и не врач, поэтому не могу обещать адвокатскую или врачебную тайну. Но я понимаю <span class="text-accent">ответственность за конфиденциальность</span> и отношусь к ней серьёзно.</p>`
        }
    ];

    const tiles = [];
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useSimpleAnim = isMobile || isReduced;

    // Создаём плитки
    cards.forEach((card, i) => {
        const tile = document.createElement('div');
        tile.className = 'approach-tile';
        tile.dataset.index = i;

        const numSpan = document.createElement('span');
        numSpan.className = 'approach-number';
        numSpan.textContent = card.num;

        const titleEl = document.createElement('h3');
        titleEl.innerHTML = card.title;

        const hint = document.createElement('span');
        hint.className = 'approach-tile-hint';
        hint.textContent = 'Нажмите, чтобы прочитать';

        tile.appendChild(numSpan);
        tile.appendChild(titleEl);
        tile.appendChild(hint);

        // Восстанавливаем "просмотрено" из sessionStorage
        const viewedKey = 'approach_viewed_' + i;
        if(sessionStorage.getItem(viewedKey) === 'true'){
            tile.classList.add('is-viewed');
        }

        tile.addEventListener('click', () => openModalForTile(i));
        grid.appendChild(tile);
        tiles.push(tile);
    });

    // Переменные состояния
    let isModalOpen = false;
    let modalAnimating = false;
    let scrollPos = 0;
    const APPROACH_INTERVAL = 3000;

    // =============================================
    // Утилиты
    // =============================================

    /** Получить центр сетки относительно viewport */
    function getGridCenter(){
        const rect = grid.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /** Получить центр плитки относительно viewport */
    function getTileCenter(el){
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /** Создать элемент вспышки */
    function createFlash(cx, cy){
        const flash = document.createElement('div');
        flash.className = 'approach-flash';
        const size = 200;
        flash.style.left = (cx - size/2) + 'px';
        flash.style.top = (cy - size/2) + 'px';
        flash.style.width = size + 'px';
        flash.style.height = size + 'px';
        document.body.appendChild(flash);
        return flash;
    }

    /** WAAPI анимация вспышки */
    function animateFlash(flash, duration = 250){
        return flash.animate([
            { opacity: 0, transform: 'scale(0.3)' },
            { opacity: 1, transform: 'scale(1.2)', offset: 0.4 },
            { opacity: 0, transform: 'scale(1.5)' }
        ], {
            duration,
            easing: 'ease-out',
            fill: 'forwards'
        }).finished.then(() => {
            flash.remove();
        });
    }

    // =============================================
    // Анимация появления при скролле
    // =============================================

    let hasRevealed = false;

    function revealTiles(){
        if(hasRevealed) return;
        hasRevealed = true;

        if(useSimpleAnim){
            // Простой fadeIn + translateY, stagger по рядам
            tiles.forEach((tile, i) => {
                const row = Math.floor(i / 2);
                setTimeout(() => {
                    tile.classList.add('is-visible');
                }, row * 150);
            });
            return;
        }

        // Полноценная анимация: колода → раскладка
        // Сначала прячем плитки, устанавливаем их в центр
        const center = getGridCenter();

        tiles.forEach((tile) => {
            tile.classList.add('is-animating');
            const ownCenter = getTileCenter(tile);
            const dx = center.x - ownCenter.x;
            const dy = center.y - ownCenter.y;
            // Стартовая позиция — центр сетки
            tile.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
            tile.style.opacity = '0';
        });

        // Небольшая задержка перед началом раскладки
        setTimeout(() => {
            // Раскладываем по очереди
            tiles.forEach((tile, i) => {
                setTimeout(() => {
                    // Отменяем transform → своя естественная позиция
                    tile.style.transform = '';
                    tile.style.opacity = '';
                    tile.classList.remove('is-animating');
                    tile.classList.add('is-visible');
                }, i * 120);
            });
        }, 300);
    }

    // IntersectionObserver для триггера появления
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && !hasRevealed){
                revealTiles();
                revealObserver.unobserve(grid);
            }
        });
    }, { threshold: 0.15 });

    revealObserver.observe(grid);

    // =============================================
    // Открытие модалки — fade + scale(0.95→1)
    // =============================================

    let currentTileIndex = -1;

    function openModalForTile(idx){
        if(modalAnimating || isModalOpen) return;
        modalAnimating = true;
        currentTileIndex = idx;

        // Заполняем контент
        const card = cards[idx];
        modalNumber.textContent = card.num;
        modalTitle.textContent = card.title.replace(/<[^>]*>/g, '');
        modalBody.innerHTML = card.html;

        // Отмечаем просмотренным
        const tile = tiles[idx];
        tile.classList.add('is-viewed');
        sessionStorage.setItem('approach_viewed_' + idx, 'true');

        // Блокируем скролл страницы
        scrollPos = window.scrollY;
        document.body.style.overflow = 'hidden';

        const modal = overlay.querySelector('.approach-modal');
        // Сброс transform/opacity на случай, если остались от предыдущего закрытия
        modal.style.transform = 'scale(0.95)';
        modal.style.opacity = '0';

        if(useSimpleAnim){
            // Простое открытие — WAAPI
            overlay.classList.add('is-active');
            modal.animate([
                { transform: 'scale(0.95)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
            ], {
                duration: 550,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'forwards'
            }).finished.then(() => {
                modalAnimating = false;
                isModalOpen = true;
            });
            return;
        }

        // === Полноценная анимация колоды ===
        const center = getGridCenter();

        // 1. Собираем плитки в центр (замедленная анимация ~950ms)
        const anims = tiles.map((t, i) => {
            const ownCenter = getTileCenter(t);
            const dx = center.x - ownCenter.x;
            const dy = center.y - ownCenter.y;
            // Смещение для имитации колоды (каждая следующая чуть сдвинута)
            const stackOffsetX = (i - 2.5) * 3;
            const stackOffsetY = (i - 2.5) * 2;
            const stackRotate = (i - 2.5) * 1.5;
            t.classList.add('is-animating');
            return t.animate([
                { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(${dx + stackOffsetX}px, ${dy + stackOffsetY}px) scale(0.6) rotate(${stackRotate}deg)`, opacity: 0.9 }
            ], {
                duration: 950,
                easing: 'cubic-bezier(.2,.8,.2,1)',
                fill: 'forwards'
            }).finished;
        });

        Promise.all(anims).then(() => {
            // Колода собрана — фиксируем её стили (opacity 1, не затемняем)
            tiles.forEach(t => {
                t.style.opacity = '1';
                // transform уже установлен WAAPI fill:'forwards', но фиксируем через getComputedStyle
                const cs = getComputedStyle(t);
                t.style.transform = cs.transform;
                t.style.opacity = '1';
            });

            // 2. Вспышка
            const flash = createFlash(center.x, center.y);
            animateFlash(flash, 250).then(() => {
                // 3. Показываем модалку — fade + scale(0.95→1)
                overlay.classList.add('is-active');
                modal.animate([
                    { transform: 'scale(0.95)', opacity: 0 },
                    { transform: 'scale(1)', opacity: 1 }
                ], {
                    duration: 550,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'forwards'
                }).finished.then(() => {
                    modal.style.transform = '';
                    modalAnimating = false;
                    isModalOpen = true;
                });
            });
        });
    }

    // =============================================
    // Закрытие модалки — строгая последовательность
    // =============================================

    function closeModal(){
        if(modalAnimating || !isModalOpen) return;
        modalAnimating = true;

        const center = getGridCenter();
        document.body.style.overflow = '';

        const modal = overlay.querySelector('.approach-modal');

        // Модалка исчезает (fade + scale)
        modal.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0.95)', opacity: 0 }
        ], {
            duration: 450,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards'
        }).finished.then(() => {
            overlay.classList.remove('is-active');

            if(useSimpleAnim){
                modalAnimating = false;
                isModalOpen = false;
                return;
            }

            // Отменяем WAAPI-анимации и скрываем колоду мгновенно
            tiles.forEach(t => {
                t.getAnimations().forEach(anim => anim.cancel());
                t.style.opacity = '0';
                t.style.transform = 'none';
                t.classList.add('is-animating');
                t.classList.remove('is-visible');
            });

            // Сразу запускаем появление плиток
            tiles.forEach((t, i) => {
                const ownCenter = getTileCenter(t);
                const dx = center.x - ownCenter.x;
                const dy = center.y - ownCenter.y;

                setTimeout(() => {
                    t.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
                    t.style.opacity = '0.9';

                    requestAnimationFrame(() => {
                        t.animate([
                            { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0.9 },
                            { transform: 'translate(0, 0) scale(1)', opacity: 1 }
                        ], {
                            duration: 400,
                            easing: 'cubic-bezier(.2,.8,.2,1)',
                            fill: 'forwards'
                        }).finished.then(() => {
                            t.style.transform = '';
                            t.style.opacity = '';
                            t.classList.remove('is-animating');
                            t.classList.add('is-visible');
                        });
                    });
                }, i * 80);
            });

            const totalDuration = tiles.length * 80 + 450;
            setTimeout(() => {
                modalAnimating = false;
                isModalOpen = false;
            }, totalDuration);
        });
    }

    // Обработчики закрытия
    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && overlay.classList.contains('is-active')){
            closeModal();
        }
    });

    // Если плитки уже видны при загрузке (например, якорь #approach)
    setTimeout(() => {
        if(!hasRevealed){
            const rect = grid.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0){
                revealTiles();
                revealObserver.unobserve(grid);
            }
        }
    }, 200);
})();

/* =========================================
   CONTACTS — Visit card: letter scatter + crossfade (no JS icon positioning)
   ========================================= */
(function(){
    const section = document.getElementById('contacts');
    if(!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    observer.observe(section);

    const card = document.getElementById('contactsVisitCard');
    if(!card) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1000px)').matches;
    const nameEl = document.getElementById('contactsName');
    if(!nameEl) return;

    // ── Split MAESTRO. into letter spans ──
    const text = nameEl.textContent;
    nameEl.textContent = '';
    const letters = text.split('');
    const vectors = [
        { x: 0, y: -90, r: -15 }, { x: -70, y: -60, r: 25 },
        { x: 80, y: -50, r: -20 }, { x: -40, y: 70, r: 35 },
        { x: 60, y: 65, r: -30 }, { x: -80, y: -30, r: 20 },
        { x: 40, y: 80, r: 10 }, { x: 0, y: 0, r: 0 },
    ];
    letters.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'contacts-letter';
        span.textContent = ch === '.' ? '·' : ch;
        if(ch === '.') span.classList.add('is-dot');
        nameEl.appendChild(span);
    });
    const letterSpans = nameEl.querySelectorAll('.contacts-letter');

    function getScaledVector(index, baseWidth){
        const s = (baseWidth || card.offsetWidth || 480) / 480;
        return { x: (vectors[index]?.x || 0) * s, y: (vectors[index]?.y || 0) * s, r: (vectors[index]?.r || 0) };
    }

    // ── Mobile: show contacts immediately, nothing else needed (CSS handles) ──
    if(isMobile) return;

    // ── Desktop: letter scatter on hover (CSS handles icon crossfade) ──
    if(!isReduced){
        card.addEventListener('mouseenter', () => {
            nameEl.classList.add('is-scattered');
            letterSpans.forEach((span, i) => {
                const v = getScaledVector(i);
                span.style.transitionDelay = (i * 30) + 'ms';
                span.style.transform = `translateX(${v.x}px) translateY(${v.y}px) rotate(${v.r}deg)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            nameEl.classList.remove('is-scattered');
            letterSpans.forEach((span) => {
                span.style.transitionDelay = '';
                span.style.transform = '';
            });
        });
    }

    // ── Tilt (desktop only, no reduced motion) ──
    if(isReduced) return;

    let tiltRAF = null;
    card.addEventListener('mousemove', (e) => {
        if(tiltRAF) cancelAnimationFrame(tiltRAF);
        tiltRAF = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / r.width;
            const dy = (e.clientY - r.top - r.height / 2) / r.height;
            tiltRAF = null;
        });
    });
})();
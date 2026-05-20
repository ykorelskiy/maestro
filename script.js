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
   CUSTOM CURSOR
========================================= */

const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', e => {

    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

});

const hoverItems = document.querySelectorAll(
    'a, .btn, .floating-quote'
);

hoverItems.forEach(item => {

    item.addEventListener('mouseenter', () => {

        cursor.classList.add('active');

    });

    item.addEventListener('mouseleave', () => {

        cursor.classList.remove('active');

    });

});

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
   APPROACH CAROUSEL
   transform: translateX — цикл + drag + throttle
========================================= */

(function(){
    const carousel = document.getElementById('approachCarousel');
    const track = document.getElementById('approachTrack');
    const dotsContainer = document.getElementById('approachDots');
    if(!carousel || !track || !dotsContainer) return;

    const slides = Array.from(track.querySelectorAll('.approach-slide'));
    const total = slides.length;
    if(total < 2) return;

    // --- Create dots ---
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'approach-dot';
        dot.setAttribute('aria-label', `Перейти к карточке ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.approach-dot'));

    let autoTimer = null;
    const INTERVAL = 3000;
    let currentIndex = 0;
    let slideWidth = 0;
    let isTransitioning = false;

    function calcSlideWidth(){
        if(slides.length > 0){
            const gap = 28;
            slideWidth = slides[0].offsetWidth + gap;
        }
    }

    function getCenterOffset(index){
        const carouselWidth = carousel.clientWidth;
        const slideW = slides[0].offsetWidth;
        return carouselWidth / 2 - slideW / 2 - index * slideWidth;
    }

    function setActive(index){
        if(index < 0 || index >= total) return;
        currentIndex = index;
        slides.forEach(el => el.classList.remove('is-active'));
        slides[index].classList.add('is-active');
        dots.forEach(el => el.classList.remove('is-active'));
        if(dots[index]) dots[index].classList.add('is-active');
    }

    function goToSlide(index){
        if(index < 0 || index >= total) return;
        if(isTransitioning) return;
        isTransitioning = true;
        setTimeout(() => { isTransitioning = false; }, 550);
        calcSlideWidth();
        const offset = getCenterOffset(index);
        track.style.transform = `translateX(${offset}px)`;
        setActive(index);
    }

    function stepForward(){
        const next = (currentIndex + 1) % total;
        goToSlide(next);
    }

    function stepBackward(){
        const prev = (currentIndex - 1 + total) % total;
        goToSlide(prev);
    }

    // Wheel / тачпад MacBook
    let wheelTimer = null;
    carousel.addEventListener('wheel', (e) => {
        // Throttle: одно срабатывание за 300 мс
        if(wheelTimer) return;
        wheelTimer = setTimeout(() => { wheelTimer = null; }, 300);

        if(e.deltaY > 0){
            stepForward();
        } else {
            stepBackward();
        }
        stopAuto();
        setTimeout(startAuto, INTERVAL);
    }, { passive: true });

    // Drag handler (мышью)
    let isDragging = false;
    let dragStartX = 0;
    let dragStartTrack = 0;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartTrack = currentIndex;
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if(!isDragging) return;
        const diff = e.clientX - dragStartX;
        if(Math.abs(diff) > slideWidth * 0.3){
            isDragging = false;
            carousel.style.cursor = '';
            if(diff < 0){
                stepForward();
            } else {
                stepBackward();
            }
            stopAuto();
            setTimeout(startAuto, INTERVAL);
        }
    });

    document.addEventListener('mouseup', () => {
        if(isDragging){
            isDragging = false;
            carousel.style.cursor = '';
        }
    });

    // Touch/swipe handler
    let touchStartX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if(Math.abs(diff) > 30){
            if(diff > 0){
                stepForward();
            } else {
                stepBackward();
            }
            stopAuto();
            setTimeout(startAuto, INTERVAL);
        }
    }, { passive: true });

    function startAuto(){
        stopAuto();
        autoTimer = setInterval(stepForward, INTERVAL);
    }

    function stopAuto(){
        if(autoTimer){ clearInterval(autoTimer); autoTimer = null; }
    }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            stopAuto();
            setTimeout(startAuto, INTERVAL);
        });
    });

    // Keyboard
    document.addEventListener('keydown', function(e) {
        const overlay = document.getElementById('manifestOverlay');
        if(overlay && overlay.classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            stepForward();
            stopAuto();
            setTimeout(startAuto, INTERVAL);
        }
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stepBackward();
            stopAuto();
            setTimeout(startAuto, INTERVAL);
        }
    });

    // Init
    calcSlideWidth();
    const initOffset = getCenterOffset(0);
    track.style.transform = `translateX(${initOffset}px)`;
    setActive(0);
    startAuto();

    // Recalc on resize
    window.addEventListener('resize', () => {
        calcSlideWidth();
        const offset = getCenterOffset(currentIndex);
        track.style.transform = `translateX(${offset}px)`;
    });
})();

/* =========================================
   CONTACTS — Visit card: letter scatter + icon migration + tilt
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
    let cardWidth = card.offsetWidth || 480;

    function getScaledVector(index, baseWidth){
        const s = baseWidth / 480;
        return { x: (vectors[index]?.x || 0) * s, y: (vectors[index]?.y || 0) * s, r: (vectors[index]?.r || 0) };
    }

    const iconTelegram = card.querySelector('.contacts-icon--telegram');
    const iconEmail = card.querySelector('.contacts-icon--email');
    const anchorTelegram = card.querySelector('[data-anchor="telegram"]');
    const anchorEmail = card.querySelector('[data-anchor="email"]');
    const rows = card.querySelectorAll('.contacts-contact-row');

    // ── Mobile: show contacts immediately ──
    if(isMobile && rows.length === 2){
        if(iconTelegram) iconTelegram.style.display = 'none';
        if(iconEmail) iconEmail.style.display = 'none';
        return;
    }
    if(!iconTelegram || !iconEmail || !anchorTelegram || !anchorEmail) return;

    // ── Desktop: resting + hover positions ──

    const ICON_SIZE = 24;
    const DST_SIZE = 16;
    const DST_SCALE = DST_SIZE / ICON_SIZE;
    const HALF = ICON_SIZE / 2;

    function computePositions(){
        const cr = card.getBoundingClientRect();

        // Resting: use the resting container as reference for Y
        const restingEl = card.querySelector('.contacts-resting');
        // The name element's bottom gives us the Y for resting icons
        const nameRect = nameEl.getBoundingClientRect();
        const nameBottom = nameRect.bottom - cr.top;

        const cx = cr.width / 2;
        const spread = 22;
        const restY = nameBottom + 12; // 12px gap below name

        restingPos.tg = { x: cx - spread - HALF, y: restY - HALF };
        restingPos.em = { x: cx + spread - HALF, y: restY - HALF };

        // Target: anchor top-left in card coordinates
        const aTg = anchorTelegram.getBoundingClientRect();
        const aEm = anchorEmail.getBoundingClientRect();
        targetPos.tg = { x: aTg.left - cr.left, y: aTg.top - cr.top };
        targetPos.em = { x: aEm.left - cr.left, y: aEm.top - cr.top };

        // Center scaled icon (16px) within anchor (24px)
        const off = (aTg.width - DST_SIZE) / 2;
        targetPos.tg.x += off;
        targetPos.tg.y += off;
        targetPos.em.x += off;
        targetPos.em.y += off;

        // Telegram optical tweak
        targetPos.tg.y -= 2;
    }

    // Initial compute and apply resting WITHOUT transition
    computePositions();
    iconTelegram.style.transform = `translate(${restingPos.tg.x}px, ${restingPos.tg.y}px) scale(1)`;
    iconEmail.style.transform = `translate(${restingPos.em.x}px, ${restingPos.em.y}px) scale(1)`;

    // Force reflow, THEN set transition
    void card.offsetWidth;
    const TRANSITION = 'transform .6s cubic-bezier(.22,1,.36,1)';
    iconTelegram.style.transition = TRANSITION;
    iconEmail.style.transition = TRANSITION;

    function applyResting(){
        iconTelegram.style.transform = `translate(${restingPos.tg.x}px, ${restingPos.tg.y}px) scale(1)`;
        iconEmail.style.transform = `translate(${restingPos.em.x}px, ${restingPos.em.y}px) scale(1)`;
    }

    function applyHover(){
        iconTelegram.style.transform = `translate(${targetPos.tg.x}px, ${targetPos.tg.y}px) scale(${DST_SCALE})`;
        iconEmail.style.transform = `translate(${targetPos.em.x}px, ${targetPos.em.y}px) scale(${DST_SCALE})`;
    }

    let resizeTimer = null;
    const recalc = () => {
        if(resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            computePositions();
            if(!card._isHovering){
                applyResting();
            } else {
                applyHover();
            }
        }, 100);
    };
    window.addEventListener('resize', recalc);

    const ro = new ResizeObserver(() => recalc());
    ro.observe(card);

    // ── Hover logic (desktop only) ──
    if(!isReduced && !isMobile){
        card.addEventListener('mouseenter', () => {
            card._isHovering = true;
            // Recompute on each hover to catch any layout shifts
            computePositions();
            applyHover();

            // Letter scatter
            cardWidth = card.offsetWidth || 480;
            nameEl.classList.add('is-scattered');
            letterSpans.forEach((span, i) => {
                const v = getScaledVector(i, cardWidth);
                span.style.transitionDelay = (i * 30) + 'ms';
                span.style.transform = `translateX(${v.x}px) translateY(${v.y}px) rotate(${v.r}deg)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            card._isHovering = false;
            applyResting();

            nameEl.classList.remove('is-scattered');
            letterSpans.forEach((span) => {
                span.style.transitionDelay = '';
                span.style.transform = '';
            });
        });
    }

    // ── Tilt (desktop only) ──
    if(isReduced || isMobile) return;

    let tiltRAF = null;
    card.addEventListener('mousemove', (e) => {
        if(tiltRAF) cancelAnimationFrame(tiltRAF);
        tiltRAF = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / r.width;
            const dy = (e.clientY - r.top - r.height / 2) / r.height;
            // Don't override hover transform — tilt is applied via different property if needed
            // For now, tilt only when not hovering (rare edge case), or just use separate layer
            tiltRAF = null;
        });
    });
})();

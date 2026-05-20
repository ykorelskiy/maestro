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
   Полностью переписан на transform: translateX.
   Никакого scroll-snap — полный контроль.
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
    const INTERVAL = 3000; // 3 секунды
    let currentIndex = 0;
    let slideWidth = 0;

    function calcSlideWidth(){
        if(slides.length > 0){
            const gap = 28;
            slideWidth = slides[0].offsetWidth + gap;
        }
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
        calcSlideWidth();
        const offset = -index * slideWidth;
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

    // Wheel handler (мышь колёсиком)
    carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
        if(e.deltaY > 0){
            stepForward();
        } else {
            stepBackward();
        }
        stopAuto();
        setTimeout(startAuto, INTERVAL);
    }, { passive: false });

    // Touch/swipe handler
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
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

    // Click on dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            stopAuto();
            setTimeout(startAuto, INTERVAL);
        });
    });

    // Keyboard navigation
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
    setActive(0);
    startAuto();

    // Recalc on resize
    window.addEventListener('resize', () => {
        calcSlideWidth();
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;
    });
})();
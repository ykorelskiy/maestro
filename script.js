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
    APPROACH GRID — плитки + модалка
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

    // Создаём плитки
    const tiles = [];
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

        tile.addEventListener('click', () => {
            // Заполняем модалку
            modalNumber.textContent = card.num;
            modalTitle.textContent = card.title.replace(/<[^>]*>/g, '');
            modalBody.innerHTML = card.html;

            // Отмечаем просмотренным
            tile.classList.add('is-viewed');
            sessionStorage.setItem(viewedKey, 'true');

            // Открываем
            overlay.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });

        grid.appendChild(tile);
        tiles.push(tile);
    });

    // Закрытие модалки
    function closeModal(){
        overlay.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && overlay.classList.contains('is-active')){
            closeModal();
        }
    });

    // IntersectionObserver — stagger-появление
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                const idx = parseInt(entry.target.dataset.index);
                // Задержка: первый ряд (0,1) без задержки, второй ряд (2,3) — 150ms, третий ряд (4,5) — 300ms
                const row = Math.floor(idx / 2);
                const delay = row * 150;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    tiles.forEach(tile => observer.observe(tile));
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

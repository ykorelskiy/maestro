# MAESTRO — Project Progress Log

> Журнал состояния проекта. Прикладывать к каждому запросу к ИИ.
> Обновлять ПОСЛЕ каждого завершённого шага.

---

## 📊 Общий прогресс

- **Фаза:** 1 — Аудит и стабилизация Hero
- **Версия проекта:** v0.1.2
- **Дата последнего обновления:** 2025-01-XX
- **Соответствие handoff:** ~50% (готова Section 1 + начало Section 2; вынесена модалка; scroll-engine)

---

## 🗂 Структура проекта

```
/project
  index.html        ← основной файл
  style.css         ← все стили (кроме inline в index.html — TODO вынести)
  script.js         ← вся логика (кроме модалки — TODO вынести)
  /images
    hero-001.jpg
    smoke-001.png
    texture-noise.png
  /docs
    handoff.md
    progress.md     ← этот файл
```

---

## ✅ Сделано

### Section 1 — Hero
- [x] Базовая разметка (label, title, text, buttons, floating quote)
- [x] Custom cursor (увеличение на hover)
- [x] Parallax: 3 слоя (bg-base, bg-smoke, bg-light)
- [x] Reveal-on-scroll через IntersectionObserver
- [x] Grayscale → color при hover на .hero
- [x] Hero fade при скролле
- [x] Scroll indicator (анимированная линия)
- [x] Typography background ("CONTROL" вертикально)

### Section 2 — Transition (частично)
- [x] Заглушка: "Психика редко говорит напрямую"
- [ ] Полноценная секция по §4 handoff — TODO

### Прочее
- [x] Navigation (фиксированный)
- [x] Модалка "Манифест" с открытием/закрытием/Esc
- [x] Mobile breakpoint 1000px
- [x] CSS-переменные в :root (базовые токены)
- [x] Шрифты Inter + Cormorant Garamond

---

## 🚧 Известные проблемы (issues)

| # | Приоритет | Что | Где |
|---|---|---|---|
| 1 | 🔴 | Два scroll-листенера без rAF — производительность | script.js |
| 2 | 🔴 | Inline CSS/JS модалки в index.html | index.html |
| 3 | 🔴 | Нет prefers-reduced-motion | style.css |
| 4 | 🔴 | Магическое число в hero fade (/1400) | script.js |
| 5 | 🟡 | Кастомный курсор не отключён на touch | script.js |
| 6 | 🟡 | Floating quote перекрывает кнопки на мобиле | style.css |
| 7 | 🟡 | Реализованы 3 parallax-слоя из 5 (нет grain, vignette) | index.html, style.css |
| 8 | 🟢 | Нет focus trap в модалке | index.html |
| 9 | 🟢 | Нет meta description, OG-тегов | index.html |
| 10 | 🟢 | Нет skip-link, aria-label на nav | index.html |

---

## 🔑 Якорные сущности кода (не ломать без контекста)

### CSS (`style.css`)
- `:root { --bg, --surface, --text, --muted, --accent, --border, --transition }` — токены.
- `.cursor` / `.cursor.active` — кастомный курсор.
- `.nav` — фиксированная навигация, z-index 200.
- `.hero` — главный экран, height: 100vh.
- `.bg-base`, `.bg-smoke`, `.bg-light` — parallax-слои.
- `.hero-word` — фоновый "CONTROL".
- `.floating-quote` — карточка цитаты справа-снизу.
- `.scroll-indicator` — анимированная линия снизу.
- `.transition-section` — Section 2 (заглушка).
- `.reveal` / `.reveal.active` — система появления на скролле.

### JS (`script.js`)
- `cursor` mousemove + hover items — кастомный курсор.
- `revealObserver` (IntersectionObserver, threshold 0.2).
- Два `window.scroll` листенера: parallax + hero fade. **⚠️ объединить в rAF.**

### HTML (`index.html`)
- `.cursor`, `.noise` — глобальные оверлеи.
- `.nav` — навигация.
- `.hero` → `.hero-background` (3 слоя) + `.hero-word` + `.hero-content` + `.floating-quote` + `.scroll-indicator`.
- `.transition-section`.
- `#manifestOverlay` — модалка (inline-стили и inline-скрипт — TODO вынести).

---

## 📅 План ближайших шагов

### Фаза 1 — Стабилизация (текущая)
- [x] **1.1** Вынести inline CSS/JS модалки во внешние файлы. ✅ v0.1.1
- [x] **1.2** Объединить scroll-листенеры в единый rAF-engine. ✅ v0.1.2
- [ ] **1.3** Добавить prefers-reduced-motion.
- [ ] **1.4** Отключить кастомный курсор на touch-устройствах.
- [ ] **1.5** Проверить и поправить mobile-вёрстку Hero.
- [ ] **1.6** Расширить CSS-токены по §5–6 handoff (spacing, sizes).

### Фаза 2 — Scroll storytelling
- [ ] Добавить недостающие parallax-слои (grain, vignette).
- [ ] Реализовать прогресс-по-секциям из scroll-engine.

### Фаза 3+ — см. roadmap в handoff §4.

---

## 📌 Решения и договорённости

- **Stack:** vanilla HTML/CSS/JS, без библиотек.
- **Стиль кода:** Allman-like (открывающая скобка с новой строки, пустые строки между логическими блоками) — по образцу текущего script.js.
- **Шрифты:** Inter (UI), Cormorant Garamond (акценты/курсив).
- **Палитра:** см. `:root` в style.css.
- **Брейкпойнт:** 1000px (mobile).
- **Анимации:** базовый easing `cubic-bezier(.2,.8,.2,1)`, длительность 400ms.

---

## 📝 Журнал изменений

### v0.1.2 — Scroll-engine (rafScroll)
- Добавлен блок SCROLL ENGINE в начало script.js — IIFE с подпиской на единый scroll-listener через requestAnimationFrame.
- API: `rafScroll.subscribe(fn)` — fn получает scrollY первым аргументом, вызывается сразу при подписке (правильное состояние при reload посередине страницы).
- Блок PARALLAX переведён на rafScroll.subscribe().
- Блок HERO FADE переведён на rafScroll.subscribe().
- Итог: 1 scroll-listener в файле (внутри rafScroll), 0 пользовательских listener'ов.

### v0.1.1 — Рефакторинг: вынос модалки
- Вынесен inline CSS модалки "Манифест" (~112 строк) из index.html в style.css.
- Вынесен inline JS модалки "Манифест" (~28 строк) из index.html в script.js.
- index.html: 324 → 179 строк.
- HTML-разметка модалки и логика работы НЕ менялись.

### v0.1 — Initial state
- Стартовая версия от пользователя.
- Реализован Hero + transition + модалка.

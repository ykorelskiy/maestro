# HANDOFF — PERSONAL WEBSITE CONCEPT

## MAESTRO — Психолог / Сексолог / BDSM-aware specialist

---

# 1. ОБЩАЯ КОНЦЕПЦИЯ

Сайт НЕ должен выглядеть:

* как porn/BDSM сайт,
* как «доминант с кнутом»,
* как эзотерика,
* как типовой сайт психолога.

Сайт должен выглядеть как:

* premium editorial experience,
* modern brutalism,
* cinematic storytelling,
* underground luxury aesthetics,
* intellectual sexuality,
* psychological depth.

Визуальные ассоциации:

* A24 films,
* fashion editorials,
* brutalist architecture,
* psychological thriller aesthetics,
* modern underground culture.

---

# 2. КЛЮЧЕВАЯ ИДЕЯ САЙТА

Это НЕ просто лендинг.

Это:

# scroll-driven psychological experience

Пользователь:

* не просто читает,
* а «погружается» внутрь психики.

Главная идея:

* исследование желаний,
* власти,
* контроля,
* стыда,
* фантазий,
* внутренних конфликтов,
* сексуальности.

---

# 3. HERO SECTION — ОСНОВНАЯ ИДЕЯ

Hero section — это cinematic сцена.

---

## Начальная сцена

Темное пространство.

Нижняя:

* стоит на коленях,
* руки связаны за спиной,
* повязка на глазах.

Но:

* НЕ эротично,
* НЕ pornographic,
* НЕ literal BDSM imagery.

Это:

* психологический символизм,
* эмоциональное напряжение,
* vulnerability,
* surrender,
* introspection.

---

# 4. SCROLL STORYTELLING

Главная фишка сайта.

При scroll:

* камера медленно приближается,
* background layers движутся с разной скоростью,
* появляются typographic overlays,
* проявляются psychological fragments,
* начинается «погружение внутрь».

---

## Следующий этап storytelling

После приближения:
камера условно «проходит» внутрь головы.

Там:

* abstract imagery,
* fragmented memories,
* symbols,
* fears,
* desires,
* shame,
* fantasies,
* textures,
* distorted typography,
* emotional states.

---

# 5. ВИЗУАЛЬНЫЙ СТИЛЬ

## Основной стиль

Modern brutalism + editorial minimalism.

---

## Цветовая схема

### Background

```css
#050505
```

### Surface

```css
#111111
```

### Text

```css
#f2f2f2
```

### Muted text

```css
#8b8b8b
```

### Accent color

```css
#ff6b1a
```

Accent используется:

* редко,
* очень дозированно,
* только для акцентов.

---

# 6. ТИПОГРАФИКА

## Основной шрифт

Inter

---

## Акцентный шрифт

Cormorant Garamond

Используется:

* italic,
* emotional emphasis,
* sensual contrast.

---

# 7. АТМОСФЕРА

Сайт должен ощущаться:

* дорогим,
* холодным,
* интеллектуальным,
* напряженным,
* медленным,
* cinematic.

---

# 8. ЧТО НЕЛЬЗЯ ДЕЛАТЬ

## Нельзя:

* leather cliché,
* fetish-shop aesthetics,
* red-black BDSM clichés,
* chains everywhere,
* latex overload,
* aggressive domination imagery,
* porn aesthetics,
* cringe gothic visuals.

---

# 9. UX ПРИНЦИПЫ

## Много воздуха

Very spacious layout.

---

## Большая типографика

Oversized typography.

---

## Медленный ритм

Everything breathes slowly.

---

## Motion minimalism

Animations:

* subtle,
* smooth,
* premium.

Никаких:

* резких эффектов,
* flashy transitions,
* cheap animations.

---

# 10. АНИМАЦИИ

## Использовать:

* parallax,
* reveal on scroll,
* grayscale → color,
* subtle zoom,
* cinematic transitions,
* layered movement,
* atmospheric motion.

---

## Не использовать:

* bounce,
* flashy hover,
* neon effects,
* glitch overload,
* cyberpunk clichés.

---

# 11. GRAYSCALE → COLOR

Изображения:

* по умолчанию черно-белые,
* при hover плавно приобретают цвет.

---

## Реализация

Используется:

```css
filter: grayscale(100%);
```

Hover:

```css
filter: grayscale(0%);
```

НЕ использовать две картинки.

---

# 12. PARALLAX АРХИТЕКТУРА

Используется layered parallax.

---

## Layers

### Layer 1

Foreground character.

---

### Layer 2

Smoke / fog / dust.

---

### Layer 3

Architecture / concrete / light.

---

### Layer 4

Typography overlays.

---

### Layer 5

Psychological abstract overlays.

---

# 13. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ

## Стек

Только:

* HTML
* CSS
* Vanilla JS

---

## НЕ использовать:

* React
* Vue
* GSAP
* Three.js
* Bootstrap
* jQuery
* heavy libraries

---

# 14. АРХИТЕКТУРА ПРОЕКТА

```plaintext
/project
    index.html
    style.css
    script.js

    /images
        hero-001.jpg
        smoke-001.png
        texture-noise.png
```

---

# 15. ИЗОБРАЖЕНИЯ

Изображения НЕ должны быть:

* stock-looking,
* glossy,
* over-retouched,
* commercial.

---

## Стиль изображений

* cinematic photography,
* fashion editorial,
* film grain,
* high contrast,
* brutalist spaces,
* volumetric light,
* subtle fog,
* emotional tension.

---

# 16. IMAGE PROMPT STYLE

Основной visual prompt style:

```text
cinematic black and white editorial photography,
psychological atmosphere,
brutalist architecture,
soft volumetric light,
film grain,
high contrast,
A24 aesthetic,
fashion editorial,
minimal environment,
emotional tension,
35mm photography,
NOT pornographic,
NOT explicit,
NOT fetish cliché
```

---

# 17. ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА

Уже реализовано:

* fullscreen hero,
* layered parallax,
* grayscale → color,
* reveal animations,
* floating quote,
* brutalist typography,
* cinematic atmosphere,
* custom cursor,
* scroll indicator,
* Russian localization.

---

# 18. ДАЛЬНЕЙШЕЕ РАЗВИТИЕ

Следующие этапы:

## Section 2

Transition into psyche.

---

## Section 3

Inner world visualization.

---

## Section 4

Approach / philosophy.

---

## Section 5

Articles / thoughts.

---

## Section 6

Contact / session booking.

---

# 19. ГЛАВНАЯ ЦЕЛЬ

Сайт должен вызывать ощущение:

> «Это не просто психолог.
> Это человек, который понимает глубинные механизмы желания, власти, страха и близости.»

---

# 20. КЛЮЧЕВОЕ ОЩУЩЕНИЕ

Не BDSM.

А:

# psychological intimacy + emotional tension + intellectual depth.

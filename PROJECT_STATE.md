# Project State — Maestro

**Last updated:** 2026-05-23 (Refactoring session)

---

## Current status

Сайт полностью структурирован, все секции заполнены контентом. Проведён рефакторинг:
починены баги, удалён мёртвый код, документация приведена в соответствие.

---

## Site structure (index.html)

1. **Header** — навигация (работает, скролл к секциям)
2. **Hero** — главный экран с параллаксом
3. **#about** — 6 карт (snap stack) с автоповтором анимации
4. **#approach** — 6 плиток (2×3) с модальным окном и анимацией колоды
5. **#requests** — облако слов (50 слов, 3 слоя, pulse-анимация)
6. **#articles** — 3 карточки статей
7. **#tools** — заглушка с описанием
8. **#contacts** — визитка с letter scatter и контактами
9. **Footer** — (отсутствует, опционально)

---

## Done in Session 1

- Добавлены 5 основных секций с правильными ID
- Навигация: ссылки меню ведут на секции
- Всё закоммичено и запушено на GitHub

## Done in Session 2
- Реализован карусель подходов с 6 карточками
- Автопроигрывание (3 секунды)
- Клавиатурная навигация (стрелки влево/вправо)
- Циклическая навигация
- Пауза при hover
- Пауза при взаимодействии пользователя
- Индикаторы слайдов

## Done in Session 3
- Карусель заменён на сетку 2×3 плиток
- Hover-эффекты (border glow, box-shadow, background tint)
- Stagger reveal через IntersectionObserver
- Модальное окно по клику на плитку
- sessionStorage для отслеживания просмотренных плиток
- Мобильная одноколоночная версия

## Done in Session 4
- Логотип «MAESTRO.» — ссылка на Hero (#hero)
- Кнопка scroll-to-top (оранжевая, правый нижний угол)

## Done in Session 5 (word cloud)
- Секция #requests: список заменён на облако слов
- 50 слов, 3 визуальных слоя (lg/md/sm)
- Pulse-анимация (10 комбинаций длительности/задержки)
- Hover: оранжевые тускнеют до серого, белые/серые — подсвечиваются оранжевым
- Все 50 слов в HTML с псевдослучайным порядком

## Done in Session 6 (refactoring)
- Удалён дубль `shimmer:hover::after` (неработающий)
- Удалён дубль `transition` для lg-слов в hover-блоке
- Починена логика `prefers-reduced-motion`: sm opacity 0.75, hover md/sm не ломается
- Удалён мёртвый tilt-код в contacts (mousemove без эффекта)
- DESIGN_SYSTEM.md приведён в соответствие с кодом
- PROJECT_STATE.md обновлён

---

## Известные проблемы

- Нет `<footer>` (опционально)
- Заголовок #articles: «Разборы и тексты», в навигации — «СТАТЬИ» (косметика)
- Кнопки «Записаться» и «Все статьи» ведут на `#` (заглушки)

---

## Lessons learned

### About Cline:
- ⚠️ ALWAYS click "Save" on diff — otherwise changes don't reach the file
- ✅ Verify with `git diff` after changes
- ✅ Narrow tasks with clear prompts work best
- ❌ Don't give Cline architectural or creative tasks (texts, design)

### About workflow:
- Architecture and texts → ChatGPT in chat
- Code implementation → Cline
- Commit often, before each experiment

### Rollback commands:
```
git reset --hard HEAD       # discard uncommitted changes
git log --oneline           # view commit history
git reset --hard <hash>     # roll back to specific commit
```

---

## Decisions and notes

- Contact form — postponed to a separate session
- Design is not changing — only filling existing structure
- Update strategy: update this file at the end of each session + on key milestones
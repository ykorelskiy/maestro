# Project State — Maestro

**Last updated:** 2026-05-20 (end of Session 2)

---

## Current status

End of Session 1. Site structure is complete, navigation works, content is empty.
Ready to start Session 2: filling sections with content.

---

## Site structure (index.html)

1. **Header** — navigation menu (working, scrolls to sections)
2. **Hero** — main screen
3. **#about** — About me *(empty)*
4. **#approach** — My approach *(carousel with 6 cards)*
5. **#articles** — Articles *(empty, no cards yet)*
6. **#tools** — Tools *(empty)*
7. **#contacts** — Contacts *(empty)*
8. **Footer**

---

## Done in Session 1

- Added 5 main sections with correct IDs
- Styled sections according to existing design system
- Fixed navigation: menu links now point to correct section IDs
- All committed and pushed to GitHub

---

## Done in Session 2
- Implemented approach carousel with 6 cards
- Added auto-play functionality (3 seconds interval)
- Implemented keyboard navigation (left/right arrows)
- Added cycle navigation (after last card - first, and vice versa)
- Added pause on hover functionality
- Added pause on user interaction functionality
- Added slide indicators with active state
- Fixed cycle navigation logic
- Fixed scroll handler conflict during animation
- Fixed keyboard navigation scope issues
- Set correct 3-second interval

---

## Planned for Session 2
- **Approach carousel implemented** — 6 cards with auto-play and navigation
- About — short paragraph
- Contacts — email / telegram (no form yet)
- Articles — 2–3 placeholder cards

Fill sections with content:
1. About — short paragraph
2. Approach — 3–5 theses
3. Contacts — email / telegram (no form yet)
4. Articles — 2–3 placeholder cards
5. Tools — list of 3–5 items

**Principle:** texts are written by user + ChatGPT in chat, Cline inserts them into HTML.

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
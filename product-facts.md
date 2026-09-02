# XiaHua OS product facts

## HamstersarusOS interaction reference

Research date: 2026-08-31.

- Reference repository: https://github.com/Hamstersarus/HamstersarusOS
- Live demo: https://hamstersarus.github.io/HamstersarusOS/
- The project is a static personal web OS built with plain HTML, CSS and JavaScript.
- GitHub's repository API reports `license: null`; the repository tree contains no LICENSE or COPYING file. This redesign therefore treats the source and bundled assets as all-rights-reserved and does not copy or adapt its code, branding, music, images or personal text.
- Observed interaction model: welcome screen, short fake boot, fixed desktop, live clock, selectable desktop icons, double-click to open on fine pointers, single-tap to open on coarse pointers, one window per app, cascading placement, click-to-front z-index management, title-bar dragging, minimize/restore through a taskbar button, and close.
- The reference has no window maximize or resize behavior. Its mobile layout keeps overlapping floating windows and can let them leave the viewport; this implementation intentionally improves that behavior with full-screen mobile apps and complete viewport clamping.
- Independent implementation scope: About, Writing, GitHub, Joker Game, Xiaohongshu, Contact and Version Archive apps using only Wang Tianyu's existing portfolio data and portrait.
- Excluded by design: copied hamster identity, lavender palette, exact logo/terminal copy, music, the reference site's games, fortune teller, visitor analytics, Discord message proxy, third-party reference images and reference audio files.

Primary factual sources:

- Repository README and file tree.
- GitHub repository API metadata and recursive tree.
- Direct interaction testing of the live demo at desktop and 390×844 mobile viewports.
- GitHub licensing guidance: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

## About profile evidence

Research date: 2026-09-02.

- Public profile structure reference: https://github.com/liyupi. The useful pattern is a short combined identity followed by quantified proof and direct routes to projects and content. None of liyupi's employer, follower, founder, ranking or publication claims are reused.
- Local source materials support an anonymized claim of GUI Agent task and trajectory evaluation across 21 mainstream apps. The public page does not expose the app list, real queries, internal systems, company names or sensitive fields.
- Local source materials support a cross-team Agent MVP evaluation batch of approximately 200 outputs scored by two sides. The page says `≈200` and does not describe them as 200 disputed cases.
- Local source materials support evaluation-data production throughput improving from 4–5 to 6–8 items per hour, summarized as `+40–60%`. This is explicitly labeled as evaluation throughput, not model-quality improvement.
- GitHub's public repository API reported 15 public repositories, including 7 non-fork repositories with 70 aggregate stars on 2026-09-02. The About page keeps 7 / 70★ as static fallbacks and recomputes both values from the public API at runtime.
- Existing public content provides three published long-form articles and twelve Xiaohongshu AI knowledge notes.

Local evidence files:

- `../AI产品经理_项目材料_补全版/00_使用说明与事实边界.md`
- `../AI产品经理_项目材料_补全版/source/01_taotian.md`
- `../AI产品经理_项目材料_补全版/source/02_yuanbao.md`
- `../AI产品经理_项目材料_补全版/source/03_auto_eval.md`
- `../AI产品经理_项目材料_补全版/source/04_search_competitor.md`

## Joker Game integration

Research date: 2026-09-02.

- Repository: https://github.com/ankhzw1876/joker-game
- Live game: https://ankhzw1876.github.io/joker-game/
- The repository is owned by `ankhzw1876`, uses the MIT License and has GitHub Pages enabled.
- Stack: Vue 3.5.34, Vite 5.4.21 and GSAP 3.15.0; the game is entirely client-side.
- Verified gameplay: a 52-card deck deals eight cards, the player selects one to five, and the game calculates poker-hand score as Chips × Mult. The three blind targets are 300, 500 and 800. Passing a blind opens a shop for Joker modifiers.
- Direct browser testing confirmed that selecting a card and playing it updates the score and remaining plays. This is a functioning game, not a static mockup.
- Direct browser testing also confirmed that the GitHub Pages build can load inside an iframe and does not return a frame-blocking response header.
- Integration uses an iframe rather than copying the build. This keeps the game repository as the source of truth and lets future game deployments appear in XiaHua OS without duplicating Vue/Vite/GSAP code.
- The game is desktop-first. XiaHua OS provides fullscreen and separate-tab controls plus a mobile landscape hint rather than claiming a fully responsive mobile game.

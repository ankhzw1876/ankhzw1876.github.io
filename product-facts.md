# HamstersarusOS reference facts

Research date: 2026-08-31.

- Reference repository: https://github.com/Hamstersarus/HamstersarusOS
- Live demo: https://hamstersarus.github.io/HamstersarusOS/
- The project is a static personal web OS built with plain HTML, CSS and JavaScript.
- GitHub's repository API reports `license: null`; the repository tree contains no LICENSE or COPYING file. This redesign therefore treats the source and bundled assets as all-rights-reserved and does not copy or adapt its code, branding, music, images or personal text.
- Observed interaction model: welcome screen, short fake boot, fixed desktop, live clock, selectable desktop icons, double-click to open on fine pointers, single-tap to open on coarse pointers, one window per app, cascading placement, click-to-front z-index management, title-bar dragging, minimize/restore through a taskbar button, and close.
- The reference has no window maximize or resize behavior. Its mobile layout keeps overlapping floating windows and can let them leave the viewport; this implementation intentionally improves that behavior with full-screen mobile apps and complete viewport clamping.
- Independent implementation scope: About, Writing, GitHub, Xiaohongshu, Contact and Version Archive apps using only Wang Tianyu's existing portfolio data and portrait.
- Excluded by design: copied hamster identity, lavender palette, exact logo/terminal copy, music, games, fortune teller, visitor analytics, Discord message proxy, third-party reference images and reference audio files.

Primary factual sources:

- Repository README and file tree.
- GitHub repository API metadata and recursive tree.
- Direct interaction testing of the live demo at desktop and 390×844 mobile viewports.
- GitHub licensing guidance: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

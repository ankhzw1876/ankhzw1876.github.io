# XiaHua OS product facts

## HamstersarusOS interaction reference

Research date: 2026-08-31.

- Reference repository: https://github.com/Hamstersarus/HamstersarusOS
- Live demo: https://hamstersarus.github.io/HamstersarusOS/
- The project is a static personal web OS built with plain HTML, CSS and JavaScript.
- GitHub's repository API reports `license: null`; the repository tree contains no LICENSE or COPYING file. This redesign therefore treats the source and bundled assets as all-rights-reserved and does not copy or adapt its code, branding, music, images or personal text.
- Observed interaction model: welcome screen, short fake boot, fixed desktop, live clock, selectable desktop icons, double-click to open on fine pointers, single-tap to open on coarse pointers, one window per app, cascading placement, click-to-front z-index management, title-bar dragging, minimize/restore through a taskbar button, and close.
- The reference has no window maximize or resize behavior. Its mobile layout keeps overlapping floating windows and can let them leave the viewport; this implementation intentionally improves that behavior with full-screen mobile apps and complete viewport clamping.
- Independent implementation scope: About, Writing, GitHub, Playground/Game, Xiaohongshu, Contact and Version Archive apps using only Wang Tianyu's existing portfolio data and portrait.
- Excluded by design: copied hamster identity, lavender palette, exact logo/terminal copy, music, the reference site's games, fortune teller, visitor analytics, Discord message proxy, third-party reference images and reference audio files.

Primary factual sources:

- Repository README and file tree.
- GitHub repository API metadata and recursive tree.
- Direct interaction testing of the live demo at desktop and 390×844 mobile viewports.
- GitHub licensing guidance: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

## About profile evidence

Research date: 2026-09-02.

- Public profile structure reference: https://github.com/liyupi. The useful pattern is a short combined identity followed by quantified proof and direct routes to projects and content. None of liyupi's employer, follower, founder, ranking or publication claims are reused.
- Local source materials support saying that the user led the first-version product flow and evaluation-boundary alignment for a cross-platform food-ordering Agent MVP, organized the evaluation data, and supported the module's launch. The page does not claim sole engineering ownership or final release authority.
- Local source materials support an anonymized claim of GUI Agent task and trajectory evaluation across 21 mainstream apps. The public page does not expose the app list, real queries, internal systems, company names or sensitive fields.
- Local source materials support a cross-team Agent MVP evaluation batch of approximately 200 outputs scored by two sides. The About page intentionally omits the number; it remains available for the relevant project materials and must not be described as 200 disputed cases.
- Local source materials support evaluation-data production throughput improving from 4–5 to 6–8 items per hour, summarized as `+40–60%`. This is explicitly labeled as evaluation throughput, not model-quality improvement. The same materials support a three-tier evaluation strategy, with the first tier exceeding 80% human-machine agreement; that percentage is not a model-success rate.
- GitHub's public repository API reported 15 public repositories, including 7 non-fork repositories with 70 aggregate stars on 2026-09-02. Repository and star information stays in the GitHub app instead of being used as proof of product impact on the About page.
- Existing public content provides three published long-form articles and twelve Xiaohongshu AI knowledge notes.

Local evidence files:

- `../AI产品经理_项目材料_补全版/00_使用说明与事实边界.md`
- `../AI产品经理_项目材料_补全版/source/01_taotian.md`
- `../AI产品经理_项目材料_补全版/source/02_yuanbao.md`
- `../AI产品经理_项目材料_补全版/source/03_auto_eval.md`
- `../AI产品经理_项目材料_补全版/source/04_search_competitor.md`

## Playground / Game integration

Research date: 2026-09-02.

- Repository: https://github.com/ankhzw1876/joker-game
- Live game: https://ankhzw1876.github.io/joker-game/
- The repository is owned by `ankhzw1876`, uses the MIT License and has GitHub Pages enabled.
- Stack: Vue 3.5.34, Vite 5.4.21 and GSAP 3.15.0; the game is entirely client-side.
- Verified gameplay: a 52-card deck deals eight cards, the player selects one to five, and the game calculates poker-hand score as Chips × Mult. The three blind targets are 300, 500 and 800. Passing a blind opens a shop for Joker modifiers.
- Direct browser testing confirmed that selecting a card and playing it updates the score and remaining plays. This is a functioning game, not a static mockup.
- Direct browser testing also confirmed that the GitHub Pages build can load inside an iframe and does not return a frame-blocking response header.
- The Games app opens as a general-purpose Playground folder, not as Joker itself. It currently contains Joker Card and URL Worlds as two real runnable files; future projects can be added as more file items without changing the homepage story.
- Selecting the Joker file lazily loads its deployed site in an iframe rather than copying the build. This keeps the game repository as the source of truth and avoids loading the game before a visitor chooses it.
- Minimizing and restoring preserves the current game session. Closing the Games window or rebooting XiaHua OS returns to the folder and unloads the iframe.
- The game is desktop-first. XiaHua OS provides fullscreen and separate-tab controls plus a mobile landscape hint rather than claiming a fully responsive mobile game.

## URL Worlds experiment — retained six-scene implementation

Upgrade date: 2026-09-10. Initial reference research: 2026-09-09.

- Visual inspiration: the Xiaohongshu post “二维码竟然能长成了樱花树？！”: https://www.xiaohongshu.com/explore/6a9538da000000001f004395
- Technical comparison: Every QR Code is an MIT-licensed React/Web Component project using WebGPU for Tree and Terrain forms: https://github.com/AlbertAZ1992/every-qrcode. Its public materials are consistent with the observed visual idea, but no direct attribution chain from the Xiaohongshu post to that repository was independently verified; the two sources are cited separately.
- URL Worlds is an independently written, zero-build HTML/CSS/JavaScript experiment with real WebGL 3D rendering. It offers City, Forest, Highlands, Snowfield, Desert and Towers scenes. It does not reuse Every QR Code code, components, branding or assets and does not claim WebGPU rendering.
- Three.js 0.160.1 is vendored locally under the MIT License, retained in `experiments/qr-skyline/vendor/THREE-LICENSE`. QR generation uses vendored `qrcode-generator` 1.4.4 by Kazuhiko Arase under the MIT License, retained in `experiments/qr-skyline/vendor/LICENSE`.
- The experiment works directly from `file://` without a build step, server or CDN. The existing `experiments/qr-skyline/` directory and URL remain in place for compatibility with published URL City links.
- Each QR module occupies a fixed square on the world XZ plane. Dark-cell objects and light terrain preserve the QR polarity in top-down projection, with a four-module quiet zone. Terrain scenes vary their height while retaining the same grid boundaries.
- Switching from an oblique view to the scan view changes only the orthographic camera's orientation and framing. For a given URL and scene, mesh positions and vertex colors remain unchanged; there is no module rearrangement or separate flat QR overlay. Changing the URL or scene rebuilds the geometry.
- QR encoding uses error-correction level M and UTF-8 bytes. Inputs are limited to HTTP(S), capped at 512 typed characters and 1,800 characters after browser URL normalization. Missing schemes receive `https://`; invalid protocols and capacity errors are rejected with a visible prompt.
- URL-seeded generation is deterministic for the same normalized URL, scene and algorithm version. High-density scenes omit city windows and limit towers to three levels to bound geometry cost.
- Browsers without WebGL receive a standard QR fallback. Reduced-motion mode skips camera transitions and automatic orbiting. Rendering pauses when the document or parent player is hidden.
- URL Worlds remains the second file in the existing Playground folder and uses the generic lazy-loading iframe player. No additional top-level desktop app is introduced.

Current-version verification completed on 2026-09-10:

- Chromium `BarcodeDetector` decoded the default homepage URL from all six scenes at desktop, 390×844 and 320×700 viewport sizes. The mobile layouts had no horizontal overflow.
- Chinese-and-emoji URL normalization and decoding, invalid-protocol rejection, and host-with-port normalization passed.
- Checksums of geometry positions and colors were identical in oblique and top-down views, confirming that camera changes do not replace or mutate the landscape.
- All six scenes decoded a 153×153 QR matrix for a long Chinese URL at 320×700 and DPR 1. The final camera framing aligns both module size and grid origin to integer physical pixels, with smooth framing interpolation during the final 15 degrees of elevation.
- Current-version homepage iframe decoded the default URL at 1440×900 desktop and 320×700 mobile parent viewports without horizontal overflow. Returning to the folder pauses rendering and restores focus to the file card; re-opening resumes, and closing unloads the iframe. Physical-phone scanning remains pending; browser decoding is not a physical-device scan.

## URL City v1 — historical implementation

Implementation date: 2026-09-09. Superseded by URL Worlds on 2026-09-10.

- The old version rendered a 2.5D city using Canvas 2D. One QR column mapped to one building and each dark module to a lit window. Switching to QR rearranged the windows into the original matrix.
- Its CITY ID, column-density mapping and high-density morph skipping belong only to v1 and are not the current UI or rendering mechanism.
- v1 passed standalone desktop/mobile and homepage iframe decoding, including a 1,640-character normalized high-density URL. These historical results do not certify the replacement 3D implementation's high-density or iframe behavior.

## QR miniature worlds experiment — current Playground entry

Implementation record: 2026-09-10. This section updates the current Playground entry; the URL Worlds sections above describe the retained six-scene implementation, not Sakura QR.

- The reference video was directly inspected: one pink blossom tree stands on a grass-bordered checker platform. Clicking moves the camera overhead while the tree and foliage transform into a colored QR; entering a different URL generates a new tree. A fixed-model, camera-only projection does not describe this reference or the new implementation.
- Visual reference: https://www.xiaohongshu.com/explore/6a9538da000000001f004395. Source-code basis: the MIT-licensed Every QR Code repository, pinned to commit `ed404c6cba9d48c04d5e08de780293cff1b242de` (npm 0.1.2), https://github.com/AlbertAZ1992/every-qrcode. No verified attribution chain establishes that this is the video author's original code; no pixel-identical reproduction is claimed.
- The `experiments/qr-sakura/` page now offers four deterministic scenes: the original blossom tree plus floating islands, a moon base and a miniature library. The three new scenes use one local instanced procedural-geometry pipeline with 44, 51 and 77 props for the default URL. The local visual revision is `micro-worlds-study-2`, retaining upstream QR/DNA `generatorVersion: 1`.
- Engine sources, pinned build dependencies and rebuilding/verification instructions are retained under `experiments/qr-sakura/engine-src/`. The self-contained local bundle needs no runtime CDN, server-side URL processing or external model assets. Full 3D requires HTTPS or localhost and a usable WebGPU adapter.
- Upstream MIT copyright and permission are retained in `experiments/qr-sakura/engine-src/upstream/LICENSE` and `experiments/qr-sakura/vendor/THIRD_PARTY_LICENSES.txt`, including bundled dependency notices. The page additionally loads the old locally vendored `qrcode-generator` as an engine-missing fallback, with its original MIT license retained in `experiments/qr-skyline/vendor/LICENSE`.
- The same normalized URL produces deterministic detail in every world. Switching worlds writes a bounded prop buffer but preserves the exact QR block field, palette, renderer and normalized URL. World props fade and clip before the QR reveal, rather than shrinking into opaque points.
- Inputs accept HTTP(S), normalize missing schemes and reject embedded credentials. The text field permits 512 characters, normalization is capped at 1,800 characters, and the upstream engine's QR version 6 ceiling is the stricter content-dependent capacity boundary. Over-capacity URLs receive a short-link prompt; the character limits do not promise equivalent QR capacity.
- Unavailable or failed WebGPU rendering falls back to a standard high-contrast QR. Reduced-motion preference freezes ambient motion and makes transitions immediate. Document, stage and same-origin parent-player visibility control rendering pause/resume.
- The homepage's second Playground file is now wired to Sakura QR. The existing `experiments/qr-skyline/` six-world app and its address remain intact, linked from the new page's footer. This changes the folder entry without adding a top-level desktop application.
- On desktop viewports at least 1121px wide, XiaHua OS also presents the same renderer as a live warm-spring sakura object beside the homepage statement. It is hydrated only after entering the desktop, launches with `embed=1&palette=spring&world=sakura`, pauses whenever an app window covers the desktop, and does not overwrite stored palette or world preferences. Narrower viewports keep the static Playground preview instead of loading an invisible WebGPU iframe.
- During development, the browser's native `BarcodeDetector` decoded `https://ankhzw1876.github.io/` from real 1200×900 WebGPU screenshots for all four selected worlds and from the 390×844 mobile layout. Reading the submitted WebGPU canvas directly can return a cleared frame; screenshot-based decoding is the appropriate visual test path here.
- Local checks passed for desktop and 320×700 screenshot decoding (default, Unicode URL, and a 41×41 matrix), 390×844 non-overflow layout, iframe decoding, minimize/restore and folder pause, unsupported-WebGPU fallback, reduced motion, invalid protocol and over-capacity rejection. Browser decoding is not a physical-phone scan; no universal device support is claimed. The prior URL Worlds results remain evidence for that implementation only.

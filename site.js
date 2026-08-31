(() => {
  const shell = document.querySelector('.os-shell');
  const welcome = document.querySelector('.welcome-screen');
  const bootScreen = document.querySelector('.boot-screen');
  const desktop = document.querySelector('.desktop');
  const wallpaper = document.querySelector('[data-wallpaper]');
  const windowLayer = document.querySelector('[data-window-layer]');
  const taskbarItems = document.querySelector('[data-taskbar-items]');
  const activeAppLabel = document.querySelector('[data-active-app]');
  const topbarPath = document.querySelector('.topbar-context span');
  const toast = document.querySelector('[data-toast]');
  const systemButton = document.querySelector('[data-system-button]');
  const systemMenu = document.querySelector('[data-system-menu]');
  const bootLines = [...document.querySelectorAll('[data-boot-line]')];
  const bootProgress = document.querySelector('[data-boot-progress]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarseQuery = window.matchMedia('(pointer: coarse)');
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  const appIds = ['about', 'writing', 'github', 'xiaohongshu', 'contact', 'archive'];
  const appMeta = {
    about: { title: '关于我', path: '~/about-me', mark: '👋' },
    writing: { title: '文章作品', path: '~/writing', mark: '✍️' },
    github: { title: 'GitHub', path: '~/github', mark: '🐙' },
    xiaohongshu: { title: '小红书', path: '~/xiaohongshu', mark: '📕' },
    contact: { title: '联系我', path: '~/contact', mark: '✉️' },
    archive: { title: '版本归档', path: '~/versions', mark: '🗂️' }
  };

  const windows = new Map();
  let phase = 'welcome';
  let entering = false;
  let topZ = 100;
  let cascade = 0;
  let activeId = null;
  let toastTimer = 0;
  let wallpaperFrame = 0;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const setPhase = (nextPhase) => {
    phase = nextPhase;
    if (shell) shell.dataset.phase = nextPhase;
  };

  const showToast = (message, duration = 2200) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
  };

  const updateClock = () => {
    const clock = document.querySelector('[data-clock]');
    if (!clock) return;
    const now = new Date();
    const value = new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    clock.textContent = value;
    clock.dateTime = now.toISOString();
  };

  const clearIconSelection = (except = null) => {
    document.querySelectorAll('[data-app-icon]').forEach((icon) => {
      const selected = icon === except;
      icon.classList.toggle('is-selected', selected);
      icon.setAttribute('aria-pressed', String(selected));
    });
  };

  const getValidHash = () => {
    const id = window.location.hash.slice(1);
    return appIds.includes(id) ? id : null;
  };

  const replaceHash = (id) => {
    const url = new URL(window.location.href);
    url.hash = id ? `#${id}` : '';
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const finishBoot = async () => {
    desktop.hidden = false;
    desktop.classList.remove('is-entering');
    void desktop.offsetWidth;
    desktop.classList.add('is-entering');
    setPhase('desktop');

    if (bootScreen && !bootScreen.hidden) {
      bootScreen.classList.add('is-ending');
      await wait(motionQuery.matches ? 0 : 460);
      bootScreen.hidden = true;
      bootScreen.classList.remove('is-ending');
    }

    showToast('系统就绪 · 双击图标开始', 2600);
    const deepLink = getValidHash();
    if (deepLink) {
      window.setTimeout(() => openApp(deepLink, document.querySelector(`[data-app-icon="${deepLink}"]`), { syncHash: false }), motionQuery.matches ? 0 : 240);
    } else {
      document.querySelector('[data-app-icon="about"]')?.focus({ preventScroll: true });
    }
  };

  const enterOS = async () => {
    if (entering || phase !== 'welcome') return;
    entering = true;
    setPhase('transition');
    welcome?.classList.add('is-leaving');
    await wait(motionQuery.matches ? 0 : 430);
    if (welcome) {
      welcome.hidden = true;
      welcome.classList.remove('is-leaving');
    }

    if (motionQuery.matches) {
      await finishBoot();
      entering = false;
      return;
    }

    setPhase('booting');
    bootLines.forEach((line) => line.classList.remove('is-visible'));
    if (bootProgress) bootProgress.style.width = '0%';
    if (bootScreen) bootScreen.hidden = false;

    for (let index = 0; index < bootLines.length; index += 1) {
      bootLines[index].classList.add('is-visible');
      if (bootProgress) bootProgress.style.width = `${((index + 1) / bootLines.length) * 100}%`;
      await wait(index === bootLines.length - 1 ? 420 : 300);
    }

    await finishBoot();
    entering = false;
  };

  const rebootOS = () => {
    appIds.forEach((id) => closeApp(id, { silent: true }));
    window.clearTimeout(toastTimer);
    toast?.classList.remove('is-visible');
    closeSystemMenu();
    desktop.hidden = true;
    desktop.classList.remove('is-entering', 'has-windows');
    if (bootScreen) {
      bootScreen.hidden = true;
      bootScreen.classList.remove('is-ending');
    }
    bootLines.forEach((line) => line.classList.remove('is-visible'));
    if (bootProgress) bootProgress.style.width = '0%';
    if (welcome) welcome.hidden = false;
    replaceHash(null);
    clearIconSelection();
    activeId = null;
    cascade = 0;
    entering = false;
    setPhase('welcome');
    syncChrome();
    window.setTimeout(() => document.querySelector('[data-enter]')?.focus(), 0);
  };

  const getFocusable = (windowElement) => [...windowElement.querySelectorAll('a[href], button, input, textarea, select, [tabindex]')];

  const setWindowFocusable = (windowElement, enabled) => {
    getFocusable(windowElement).forEach((node) => {
      if (!Object.prototype.hasOwnProperty.call(node.dataset, 'osOriginalTabindex')) {
        node.dataset.osOriginalTabindex = node.hasAttribute('tabindex') ? node.getAttribute('tabindex') : '__none__';
      }
      if (enabled) {
        const original = node.dataset.osOriginalTabindex;
        if (original === '__none__') node.removeAttribute('tabindex');
        else node.setAttribute('tabindex', original);
      } else {
        node.setAttribute('tabindex', '-1');
      }
    });
  };

  const getLayerSize = () => ({
    width: windowLayer?.clientWidth || window.innerWidth,
    height: windowLayer?.clientHeight || Math.max(0, window.innerHeight - 88)
  });

  const clampPosition = (windowElement, x, y) => {
    const layer = getLayerSize();
    const width = windowElement.offsetWidth;
    const height = windowElement.offsetHeight;
    const maxX = Math.max(8, layer.width - width - 8);
    const maxY = Math.max(8, layer.height - height - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY)
    };
  };

  const setPosition = (state, x, y) => {
    if (mobileQuery.matches) {
      state.element.style.setProperty('--window-x', '0px');
      state.element.style.setProperty('--window-y', '0px');
      return;
    }
    const next = clampPosition(state.element, x, y);
    state.x = next.x;
    state.y = next.y;
    state.element.style.setProperty('--window-x', `${next.x}px`);
    state.element.style.setProperty('--window-y', `${next.y}px`);
  };

  const placeWindow = (state, index = cascade) => {
    const step = index % 6;
    const x = 142 + step * 30;
    const y = 34 + step * 28;
    if (mobileQuery.matches) {
      state.x = x;
      state.y = y;
    }
    setPosition(state, x, y);
  };

  const createTaskButton = (state) => {
    if (!taskbarItems || state.taskButton) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'task-button';
    button.dataset.taskApp = state.id;
    button.setAttribute('aria-label', `${state.meta.title}窗口`);
    button.textContent = `${state.meta.mark} · ${state.meta.title}`;
    button.addEventListener('click', () => {
      if (state.status === 'minimized') {
        restoreApp(state.id, button);
      } else if (activeId === state.id) {
        minimizeApp(state.id);
      } else {
        focusWindow(state.id, { focusContent: true, syncHash: true });
      }
    });
    taskbarItems.appendChild(button);
    state.taskButton = button;
  };

  const syncChrome = () => {
    const visible = [...windows.values()].filter((state) => state.status === 'visible');
    desktop?.classList.toggle('has-windows', visible.length > 0);

    const active = activeId ? windows.get(activeId) : null;
    if (active?.status === 'visible') {
      if (activeAppLabel) activeAppLabel.textContent = active.meta.title;
      if (topbarPath) topbarPath.textContent = active.meta.path;
      document.title = `${active.meta.title}｜XiaHua OS`;
    } else {
      if (activeAppLabel) activeAppLabel.textContent = '桌面';
      if (topbarPath) topbarPath.textContent = '~/desktop';
      document.title = 'XiaHua OS｜王天宇';
    }

    document.querySelectorAll('.mobile-launcher [data-open-app]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.openApp === activeId && active?.status === 'visible');
    });
  };

  const focusWindow = (id, options = {}) => {
    const state = windows.get(id);
    if (!state || state.status !== 'visible') return;
    activeId = id;
    topZ += 1;
    state.z = topZ;
    state.element.style.zIndex = String(topZ);

    windows.forEach((candidate) => {
      const active = candidate.id === id && candidate.status === 'visible';
      candidate.element.classList.toggle('is-active', active);
      if (candidate.taskButton) candidate.taskButton.classList.toggle('is-active', active);
      setWindowFocusable(candidate.element, active);
    });

    if (options.syncHash !== false) replaceHash(id);
    syncChrome();
    if (options.focusContent) {
      state.element.tabIndex = -1;
      requestAnimationFrame(() => state.element.focus({ preventScroll: true }));
    }
  };

  const focusHighestVisible = () => {
    const visible = [...windows.values()].filter((state) => state.status === 'visible').sort((a, b) => b.z - a.z);
    if (visible[0]) {
      focusWindow(visible[0].id, { focusContent: true, syncHash: true });
      return true;
    } else {
      activeId = null;
      windows.forEach((state) => {
        state.element.classList.remove('is-active');
        state.taskButton?.classList.remove('is-active');
        setWindowFocusable(state.element, false);
      });
      replaceHash(null);
      syncChrome();
      return false;
    }
  };

  const openApp = (id, trigger = null, options = {}) => {
    const state = windows.get(id);
    if (!state || phase !== 'desktop') return;
    window.clearTimeout(toastTimer);
    toast?.classList.remove('is-visible');
    if (trigger) state.lastTrigger = trigger;

    if (state.status === 'closed') {
      state.status = 'visible';
      state.element.hidden = false;
      state.element.dataset.state = 'visible';
      state.element.removeAttribute('aria-hidden');
      createTaskButton(state);
      placeWindow(state);
      cascade = (cascade + 1) % 6;
      state.element.classList.remove('is-opening');
      void state.element.offsetWidth;
      if (!motionQuery.matches) state.element.classList.add('is-opening');
      state.element.addEventListener('animationend', () => state.element.classList.remove('is-opening'), { once: true });
    } else if (state.status === 'minimized') {
      state.status = 'visible';
      state.element.hidden = false;
      state.element.dataset.state = 'visible';
      state.element.removeAttribute('aria-hidden');
      state.taskButton?.classList.remove('is-minimized');
      setPosition(state, state.x, state.y);
    }

    clearIconSelection(document.querySelector(`[data-app-icon="${id}"]`));
    focusWindow(id, { focusContent: options.focusContent !== false, syncHash: options.syncHash !== false });
  };

  const minimizeApp = (id) => {
    const state = windows.get(id);
    if (!state || state.status !== 'visible') return;
    state.status = 'minimized';
    state.element.dataset.state = 'minimized';
    state.element.hidden = true;
    state.element.setAttribute('aria-hidden', 'true');
    state.element.classList.remove('is-active', 'is-dragging');
    state.taskButton?.classList.remove('is-active');
    state.taskButton?.classList.add('is-minimized');
    setWindowFocusable(state.element, false);
    if (activeId === id) activeId = null;
    const focusedWindow = focusHighestVisible();
    if (!focusedWindow) requestAnimationFrame(() => state.taskButton?.focus({ preventScroll: true }));
  };

  const restoreApp = (id, trigger = null) => {
    const state = windows.get(id);
    if (!state || state.status === 'closed') return openApp(id, trigger);
    if (trigger) state.lastTrigger = trigger;
    if (state.status === 'minimized') {
      state.status = 'visible';
      state.element.dataset.state = 'visible';
      state.element.hidden = false;
      state.element.removeAttribute('aria-hidden');
      state.taskButton?.classList.remove('is-minimized');
      setPosition(state, state.x, state.y);
    }
    focusWindow(id, { focusContent: true, syncHash: true });
  };

  const closeApp = (id, options = {}) => {
    const state = windows.get(id);
    if (!state || state.status === 'closed') return;
    const wasActive = activeId === id;
    state.status = 'closed';
    state.element.dataset.state = 'closed';
    state.element.hidden = true;
    state.element.setAttribute('aria-hidden', 'true');
    state.element.classList.remove('is-active', 'is-opening', 'is-dragging');
    setWindowFocusable(state.element, false);
    state.taskButton?.remove();
    state.taskButton = null;
    if (wasActive) activeId = null;

    if (!options.silent) {
      const focusedWindow = focusHighestVisible();
      if (!focusedWindow) {
        const preferredTarget = state.lastTrigger;
        const fallbackTarget = mobileQuery.matches
          ? document.querySelector(`.mobile-launcher [data-open-app="${id}"]`)
          : document.querySelector(`[data-app-icon="${id}"]`);
        const returnTarget = preferredTarget?.getClientRects().length ? preferredTarget : fallbackTarget;
        requestAnimationFrame(() => returnTarget?.focus?.({ preventScroll: true }));
      }
    }
  };

  const resetWindowLayout = () => {
    const open = [...windows.values()].filter((state) => state.status !== 'closed').sort((a, b) => a.z - b.z);
    const visible = open.filter((state) => state.status === 'visible');
    open.forEach((state, index) => placeWindow(state, index));
    cascade = open.length % 6;
    if (visible.length) focusWindow(visible[visible.length - 1].id, { syncHash: true });
    closeSystemMenu();
    showToast(open.length ? '窗口已经重新排列' : '当前没有打开的窗口');
  };

  const bindWindowDrag = (state) => {
    const handle = state.element.querySelector('[data-drag-handle]');
    if (!handle) return;
    let drag = null;
    let dragFrame = 0;

    const endDrag = (event) => {
      if (!drag) return;
      cancelAnimationFrame(dragFrame);
      if (handle.hasPointerCapture?.(drag.pointerId)) handle.releasePointerCapture(drag.pointerId);
      state.element.classList.remove('is-dragging');
      drag = null;
      if (event) event.preventDefault();
    };

    handle.addEventListener('pointerdown', (event) => {
      if (mobileQuery.matches || event.button !== 0 || event.target.closest('[data-window-action]')) return;
      focusWindow(state.id, { focusContent: false, syncHash: true });
      drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, windowX: state.x, windowY: state.y };
      handle.setPointerCapture(event.pointerId);
      state.element.classList.add('is-dragging');
      event.preventDefault();
    });

    handle.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const nextX = drag.windowX + event.clientX - drag.startX;
      const nextY = drag.windowY + event.clientY - drag.startY;
      cancelAnimationFrame(dragFrame);
      dragFrame = requestAnimationFrame(() => setPosition(state, nextX, nextY));
    });

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);
    handle.addEventListener('lostpointercapture', () => {
      state.element.classList.remove('is-dragging');
      drag = null;
    });
  };

  const initializeWindows = () => {
    document.querySelectorAll('[data-window]').forEach((element) => {
      const id = element.dataset.window;
      if (!appMeta[id]) return;
      element.style.setProperty('--window-width', `${Number(element.dataset.width) || 720}px`);
      element.style.setProperty('--window-height', `${Number(element.dataset.height) || 520}px`);
      element.dataset.state = 'closed';
      element.setAttribute('aria-hidden', 'true');
      element.tabIndex = -1;
      const state = {
        id,
        meta: appMeta[id],
        element,
        status: 'closed',
        x: 0,
        y: 0,
        z: 0,
        taskButton: null,
        lastTrigger: document.querySelector(`[data-app-icon="${id}"]`)
      };
      windows.set(id, state);
      setWindowFocusable(element, false);
      bindWindowDrag(state);

      element.addEventListener('pointerdown', () => {
        if (state.status === 'visible' && activeId !== id) focusWindow(id, { syncHash: true });
      });

      element.querySelector('[data-window-action="minimize"]')?.addEventListener('click', () => minimizeApp(id));
      element.querySelectorAll('[data-window-action="close"]').forEach((button) => {
        button.addEventListener('click', () => closeApp(id));
      });
    });
  };

  const closeSystemMenu = () => {
    if (!systemMenu || !systemButton) return;
    systemMenu.hidden = true;
    systemButton.setAttribute('aria-expanded', 'false');
  };

  const toggleSystemMenu = () => {
    if (!systemMenu || !systemButton) return;
    const willOpen = systemMenu.hidden;
    systemMenu.hidden = !willOpen;
    systemButton.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) systemMenu.querySelector('button, a')?.focus();
  };

  const bindLaunchers = () => {
    document.querySelectorAll('[data-app-icon]').forEach((icon) => {
      const id = icon.dataset.appIcon;
      icon.setAttribute('aria-pressed', 'false');
      icon.addEventListener('click', () => {
        clearIconSelection(icon);
        if (coarseQuery.matches) openApp(id, icon);
      });
      icon.addEventListener('dblclick', () => openApp(id, icon));
      icon.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        clearIconSelection(icon);
        openApp(id, icon);
      });
    });

    document.querySelectorAll('[data-open-app]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.openApp;
        openApp(id, button);
        closeSystemMenu();
      });
    });

    wallpaper?.addEventListener('pointerdown', (event) => {
      if (event.target === wallpaper || event.target.closest('.desktop-statement')) clearIconSelection();
    });
  };

  const bindArticleExplorer = () => {
    const rows = [...document.querySelectorAll('[data-article]')];
    const title = document.querySelector('[data-article-title]');
    const date = document.querySelector('[data-article-date]');
    const category = document.querySelector('[data-article-category]');
    const description = document.querySelector('[data-article-description]');
    const open = document.querySelector('[data-article-open]');
    const draft = document.querySelector('[data-article-draft]');

    rows.forEach((row) => {
      row.addEventListener('click', () => {
        rows.forEach((candidate) => {
          const selected = candidate === row;
          candidate.classList.toggle('is-selected', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        if (title) title.textContent = row.dataset.title || '';
        if (date) date.textContent = row.dataset.date || '';
        if (category) category.textContent = row.dataset.category || '';
        if (description) description.textContent = row.dataset.description || '';
        const hasUrl = Boolean(row.dataset.url);
        if (open) {
          open.hidden = !hasUrl;
          if (hasUrl) open.href = row.dataset.url;
        }
        if (draft) draft.hidden = hasUrl;
      });
    });
  };

  const bindRepoExplorer = () => {
    const rows = [...document.querySelectorAll('[data-repo]')];
    const title = document.querySelector('[data-repo-preview-title]');
    const kind = document.querySelector('[data-repo-preview-kind]');
    const description = document.querySelector('[data-repo-preview-description]');
    const image = document.querySelector('[data-repo-preview-image]');
    const open = document.querySelector('[data-repo-open]');
    const imageWrap = image?.closest('.repo-image');
    const markImageLoaded = () => {
      imageWrap?.classList.add('is-loaded');
      imageWrap?.classList.remove('is-error');
    };

    rows.forEach((row) => {
      row.addEventListener('click', () => {
        rows.forEach((candidate) => {
          const selected = candidate === row;
          candidate.classList.toggle('is-selected', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        if (title) title.textContent = row.dataset.repoTitle || '';
        if (kind) kind.textContent = row.dataset.repoKind || '';
        if (description) description.textContent = row.dataset.repoDescription || '';
        if (open) open.href = row.dataset.repoUrl || '#';
        if (image) {
          imageWrap?.classList.remove('is-error', 'is-loaded');
          image.src = row.dataset.repoImage || '';
          image.alt = `${row.dataset.repoTitle || 'GitHub'} 项目预览`;
          requestAnimationFrame(() => {
            if (image.complete && image.naturalWidth > 0) markImageLoaded();
          });
        }
      });
    });

    image?.addEventListener('load', markImageLoaded);
    image?.addEventListener('error', () => {
      imageWrap?.classList.remove('is-loaded');
      imageWrap?.classList.add('is-error');
    });
    if (image?.complete && image.naturalWidth > 0) markImageLoaded();
  };

  const bindXhsBoard = () => {
    const notes = [...document.querySelectorAll('[data-xhs-topic]')];
    const title = document.querySelector('[data-xhs-topic-title]');
    const detail = document.querySelector('[data-xhs-topic-detail]');
    notes.forEach((note) => {
      note.addEventListener('click', () => {
        notes.forEach((candidate) => {
          const selected = candidate === note;
          candidate.classList.toggle('is-selected', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        if (title) title.textContent = String(note.dataset.xhsTopic || '').toUpperCase();
        if (detail) detail.textContent = note.dataset.xhsDetail || '';
        if (mobileQuery.matches) {
          const board = note.parentElement;
          const left = note.offsetLeft - (board.clientWidth - note.offsetWidth) / 2;
          board.scrollTo({ left, behavior: motionQuery.matches ? 'auto' : 'smooth' });
        }
      });
    });
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast(`已复制：${value}`);
  };

  const bindCopyButtons = () => {
    document.querySelectorAll('[data-copy]').forEach((button) => {
      button.addEventListener('click', () => copyText(button.dataset.copy || 'ankhzw'));
    });
  };

  const bindPortraitTilt = () => {
    const stage = document.querySelector('[data-portrait-stage]');
    const motion = document.querySelector('[data-portrait-motion]');
    if (!stage || !motion) return;
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      motion.style.setProperty('--portrait-rx', '0deg');
      motion.style.setProperty('--portrait-ry', '0deg');
      motion.style.setProperty('--portrait-scale', '1');
    };
    stage.addEventListener('pointermove', (event) => {
      if (motionQuery.matches || coarseQuery.matches || mobileQuery.matches) return;
      const bounds = stage.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        motion.style.setProperty('--portrait-rx', `${(-ny * 12).toFixed(2)}deg`);
        motion.style.setProperty('--portrait-ry', `${(nx * 12).toFixed(2)}deg`);
        motion.style.setProperty('--portrait-scale', '1.09');
      });
    }, { passive: true });
    stage.addEventListener('pointerleave', reset);
    stage.addEventListener('pointercancel', reset);
    window.addEventListener('blur', reset);
    motionQuery.addEventListener?.('change', reset);
  };

  const updateGithubData = async () => {
    try {
      const userResponse = await fetch('https://api.github.com/users/ankhzw1876');
      if (userResponse.ok) {
        const user = await userResponse.json();
        document.querySelectorAll('[data-repo-count]').forEach((node) => {
          node.textContent = node.closest('.boot-log') ? `${user.public_repos} repos` : String(user.public_repos);
        });
      }

      const repos = [...document.querySelectorAll('[data-repo]')];
      await Promise.all(repos.map(async (row) => {
        const response = await fetch(`https://api.github.com/repos/ankhzw1876/${row.dataset.repo}`);
        if (!response.ok) return;
        const repo = await response.json();
        row.querySelectorAll('[data-repo-stars]').forEach((node) => { node.textContent = String(repo.stargazers_count); });
      }));
    } catch {
      // Static portfolio values stay visible if GitHub is unavailable or rate-limited.
    }
  };

  const bindGlobalEvents = () => {
    document.querySelector('[data-enter]')?.addEventListener('click', enterOS);
    systemButton?.addEventListener('click', toggleSystemMenu);
    document.querySelector('[data-reset-layout]')?.addEventListener('click', resetWindowLayout);
    document.querySelector('[data-reboot]')?.addEventListener('click', rebootOS);

    document.addEventListener('pointerdown', (event) => {
      if (!systemMenu || systemMenu.hidden) return;
      if (!event.target.closest('[data-system-menu], [data-system-button]')) closeSystemMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (phase === 'welcome' && event.key === 'Enter') {
        event.preventDefault();
        enterOS();
        return;
      }
      if (event.key === 'Escape' && systemMenu && !systemMenu.hidden) {
        closeSystemMenu();
        systemButton?.focus();
      }
    });

    wallpaper?.addEventListener('pointermove', (event) => {
      if (motionQuery.matches || coarseQuery.matches) return;
      const bounds = wallpaper.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      cancelAnimationFrame(wallpaperFrame);
      wallpaperFrame = requestAnimationFrame(() => {
        wallpaper.style.setProperty('--mouse-x', `${x.toFixed(2)}%`);
        wallpaper.style.setProperty('--mouse-y', `${y.toFixed(2)}%`);
      });
    }, { passive: true });

    const reclamp = () => {
      windows.forEach((state) => {
        if (state.status === 'visible') setPosition(state, state.x, state.y);
      });
    };
    window.addEventListener('resize', reclamp, { passive: true });
    window.addEventListener('orientationchange', () => window.setTimeout(reclamp, 150), { passive: true });

    window.addEventListener('hashchange', () => {
      if (phase !== 'desktop') return;
      const id = getValidHash();
      if (id) openApp(id, document.querySelector(`[data-app-icon="${id}"]`), { syncHash: false });
    });
  };

  initializeWindows();
  bindLaunchers();
  bindArticleExplorer();
  bindRepoExplorer();
  bindXhsBoard();
  bindCopyButtons();
  bindPortraitTilt();
  bindGlobalEvents();
  updateClock();
  window.setInterval(updateClock, 1000);
  updateGithubData();
})();

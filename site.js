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
  const sakuraWidget = document.querySelector('[data-sakura-widget]');
  const sakuraPreview = document.querySelector('[data-sakura-preview]');
  const systemButton = document.querySelector('[data-system-button]');
  const systemMenu = document.querySelector('[data-system-menu]');
  const bootLines = [...document.querySelectorAll('[data-boot-line]')];
  const bootProgress = document.querySelector('[data-boot-progress]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarseQuery = window.matchMedia('(pointer: coarse)');
  const mobileQuery = window.matchMedia('(max-width: 720px)');
  const sakuraPreviewQuery = window.matchMedia('(min-width: 1121px)');
  const appIds = ['about', 'writing', 'github', 'xiaohongshu', 'game', 'contact', 'archive'];
  const appMeta = {
    about: { title: '关于我', path: '~/about-me', icon: 'assets/pixel-icons/about.svg?v=2' },
    writing: { title: '文章作品', path: '~/writing', icon: 'assets/pixel-icons/writing.svg?v=2' },
    github: { title: 'GitHub', path: '~/github', icon: 'assets/pixel-icons/github.svg?v=2' },
    game: { title: '游戏文件夹', path: '~/games', icon: 'assets/pixel-icons/game.svg?v=1' },
    xiaohongshu: { title: '小红书', path: '~/xiaohongshu', icon: 'assets/pixel-icons/xiaohongshu.svg?v=2' },
    contact: { title: '联系我', path: '~/contact', icon: 'assets/pixel-icons/contact.svg?v=2' },
    archive: { title: '版本归档', path: '~/versions', icon: 'assets/pixel-icons/archive.svg?v=2' }
  };

  const windows = new Map();
  let phase = 'welcome';
  let entering = false;
  let topZ = 100;
  let cascade = 0;
  let activeId = null;
  let toastTimer = 0;
  let wallpaperFrame = 0;
  let resetGameView = () => {};
  let syncSakuraPreviewVisibility = () => {};

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
    syncSakuraPreviewVisibility(true);

    if (bootScreen && !bootScreen.hidden) {
      bootScreen.classList.add('is-ending');
      await wait(motionQuery.matches ? 0 : 460);
      bootScreen.hidden = true;
      bootScreen.classList.remove('is-ending');
    }

    showToast('系统就绪 · 单击图标开始', 2600);
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

  const getFocusable = (windowElement) => [...windowElement.querySelectorAll('a[href], button, input, textarea, select, iframe, [tabindex]')];

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
    const icon = document.createElement('img');
    icon.className = 'task-pixel-icon';
    icon.src = state.meta.icon;
    icon.alt = '';
    icon.width = 24;
    icon.height = 24;
    icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = state.meta.title;
    button.append(icon, label);
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
    syncSakuraPreviewVisibility(visible.length === 0);

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
    if (id === 'game') resetGameView({ focus: false, unload: true });
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
      icon.addEventListener('click', () => openApp(id, icon));
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
    const imageOpen = document.querySelector('[data-repo-image-open]');
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
        if (imageOpen) {
          imageOpen.href = row.dataset.repoUrl || '#';
          imageOpen.setAttribute('aria-label', `打开${row.dataset.repoTitle || '项目'}仓库`);
        }
        if (image) {
          imageWrap?.classList.remove('is-error', 'is-loaded');
          image.src = row.dataset.repoImage || '';
          image.alt = `${row.dataset.repoTitle || 'GitHub'} 项目预览`;
          image.style.setProperty('--repo-image-position', row.dataset.repoPosition || 'center');
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

  const bindXhsCoverflow = () => {
    const coverflow = document.querySelector('[data-xhs-coverflow]');
    const viewport = coverflow?.querySelector('[data-xhs-viewport]');
    const cards = [...(coverflow?.querySelectorAll('[data-xhs-card]') || [])];
    const title = document.querySelector('[data-xhs-topic-title]');
    const position = coverflow?.querySelector('[data-xhs-position]');
    if (!coverflow || !viewport || !cards.length) return;

    cards.forEach((card) => {
      const image = card.querySelector('img');
      if (image) image.loading = 'eager';
    });

    let index = 0;
    let pointerStart = null;
    let suppressClick = false;

    const wrapOffset = (cardIndex) => {
      let offset = cardIndex - index;
      if (offset > cards.length / 2) offset -= cards.length;
      if (offset < -cards.length / 2) offset += cards.length;
      return offset;
    };

    const render = () => {
      const viewportWidth = viewport.clientWidth || 760;
      const cardWidth = cards[0]?.offsetWidth || (mobileQuery.matches ? 200 : 232);
      const firstStep = mobileQuery.matches
        ? Math.min(viewportWidth * .34, cardWidth * .7)
        : Math.min(viewportWidth * .245, cardWidth * .84);
      const secondStep = mobileQuery.matches ? firstStep * 1.72 : firstStep * 1.65;

      cards.forEach((card, cardIndex) => {
        const offset = wrapOffset(cardIndex);
        const distance = Math.abs(offset);
        const direction = Math.sign(offset);
        const active = distance === 0;
        const selectable = distance > 0 && distance <= 2;
        const far = distance > 2;
        const x = distance === 0 ? 0 : direction * (distance === 1 ? firstStep : secondStep);
        const select = card.querySelector('[data-xhs-select]');

        card.id = `xhs-cover-${cardIndex + 1}`;
        card.style.setProperty('--xhs-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--xhs-y', `${Math.min(distance, 2) * 5}px`);
        card.style.setProperty('--xhs-z', `${Math.min(distance, 2) * -155}px`);
        card.style.setProperty('--xhs-rotate', `${direction * (distance === 1 ? -23 : -29)}deg`);
        card.style.setProperty('--xhs-scale', active ? '1' : distance === 1 ? '.88' : '.75');
        card.style.setProperty('--xhs-opacity', active ? '1' : distance === 1 ? '.7' : distance === 2 ? '.4' : '0');
        card.style.setProperty('--xhs-saturation', active ? '1' : distance === 1 ? '.76' : '.55');
        card.style.setProperty('--xhs-brightness', active ? '1' : distance === 1 ? '.83' : '.66');
        card.style.setProperty('--xhs-order', String(20 - distance));
        card.classList.toggle('is-active', active);
        card.classList.toggle('is-selectable', selectable);
        card.classList.toggle('is-far', far);
        card.inert = far;
        if (far) card.setAttribute('aria-hidden', 'true');
        else card.removeAttribute('aria-hidden');
        if (active) card.setAttribute('aria-current', 'true');
        else card.removeAttribute('aria-current');
        if (select) select.tabIndex = selectable ? 0 : -1;
      });

      const activeCard = cards[index];
      coverflow.dataset.index = String(index);
      if (title) title.textContent = activeCard.dataset.xhsTitle || '';
      if (position) position.textContent = `${index + 1} / ${cards.length}`;
    };

    const goTo = (nextIndex) => {
      index = (nextIndex + cards.length) % cards.length;
      render();
    };

    cards.forEach((card, cardIndex) => {
      card.querySelector('[data-xhs-select]')?.addEventListener('click', (event) => {
        if (suppressClick) {
          event.preventDefault();
          return;
        }
        goTo(cardIndex);
        viewport.focus({ preventScroll: true });
      });
    });

    coverflow.querySelector('[data-xhs-prev]')?.addEventListener('click', () => goTo(index - 1));
    coverflow.querySelector('[data-xhs-next]')?.addEventListener('click', () => goTo(index + 1));

    viewport.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
      if (event.key === 'Home') goTo(0);
      if (event.key === 'End') goTo(cards.length - 1);
    });

    viewport.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary) return;
      pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
      try { viewport.setPointerCapture?.(event.pointerId); } catch { /* Pointer already ended. */ }
    }, { passive: true });

    viewport.addEventListener('pointerup', (event) => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      suppressClick = true;
      goTo(dx < 0 ? index + 1 : index - 1);
      window.setTimeout(() => { suppressClick = false; }, 260);
    }, { passive: true });

    viewport.addEventListener('pointercancel', () => { pointerStart = null; }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(render).observe(viewport);
    else window.addEventListener('resize', render);
    render();
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

  const bindGamePlayer = () => {
    const gameApp = document.querySelector('[data-game-app]');
    const library = document.querySelector('[data-game-library]');
    const player = document.querySelector('[data-game-player]');
    const gameItems = [...document.querySelectorAll('[data-game-item]')];
    const back = document.querySelector('[data-game-back]');
    const windowPath = document.querySelector('[data-game-window-path]');
    const playerTitle = document.querySelector('[data-game-player-title]');
    const playerSubtitle = document.querySelector('[data-game-player-subtitle]');
    const standalone = document.querySelector('[data-game-standalone]');
    const repository = document.querySelector('[data-game-repository]');
    const frame = document.querySelector('[data-game-frame]');
    const stage = document.querySelector('[data-game-stage]');
    const reload = document.querySelector('[data-game-reload]');
    const fullscreen = document.querySelector('[data-game-fullscreen]');
    const loadingIcon = document.querySelector('.game-loading [data-game-loading-icon]');
    const loadingText = document.querySelector('[data-game-loading-text]');
    const mobileNote = document.querySelector('.game-mobile-note[data-game-mobile-note]');
    const loadingState = document.querySelector('[data-game-loading-state]');
    if (!gameApp || !library || !player || !frame || !stage) return;
    let lastGameItem = null;
    let loadingTimer = 0;

    const notifyFrameVisibility = (visible) => {
      if (!frame.contentWindow) return;
      let targetOrigin = '*';
      try {
        const resolvedOrigin = new URL(frame.dataset.activeSrc || frame.src || '', location.href).origin;
        if (resolvedOrigin && resolvedOrigin !== 'null') targetOrigin = resolvedOrigin;
      } catch {
        targetOrigin = '*';
      }
      try {
        frame.contentWindow.postMessage({ type: 'xiahua:visibility', visible }, targetOrigin);
      } catch {
        // A cross-origin frame can disappear between resolving its URL and posting.
      }
    };

    const clearLoadingTimer = () => {
      window.clearTimeout(loadingTimer);
      loadingTimer = 0;
    };

    const showLoadingState = (label) => {
      clearLoadingTimer();
      frame.classList.remove('is-ready');
      if (loadingText) loadingText.textContent = label;
      if (loadingState) loadingState.hidden = false;
      loadingTimer = window.setTimeout(() => {
        if (loadingText) loadingText.textContent = '加载时间较长，可尝试“独立打开”。';
      }, 9000);
    };

    const showLoadedFrame = () => {
      if (!frame.dataset.activeSrc) return;
      clearLoadingTimer();
      frame.dataset.readySrc = frame.dataset.activeSrc;
      if (loadingState) loadingState.hidden = true;
      frame.classList.add('is-ready');
      notifyFrameVisibility(true);
    };

    frame.addEventListener('load', showLoadedFrame);

    const syncGamePath = (path) => {
      const nextPath = path ? `~/games/${path}` : '~/games';
      if (windowPath) windowPath.textContent = nextPath;
      appMeta.game.path = nextPath;
      if (activeId === 'game') syncChrome();
    };

    const showLibrary = ({ focus = true, unload = false } = {}) => {
      notifyFrameVisibility(false);
      clearLoadingTimer();
      if (loadingState) loadingState.hidden = true;
      gameApp.dataset.view = 'library';
      library.hidden = false;
      library.inert = false;
      player.hidden = true;
      player.inert = true;
      syncGamePath('');
      if (unload) {
        clearLoadingTimer();
        frame.classList.remove('is-ready');
        if (loadingState) loadingState.hidden = true;
        frame.removeAttribute('src');
        delete frame.dataset.loaded;
        delete frame.dataset.readySrc;
        delete frame.dataset.activeSrc;
      }
      if (focus) requestAnimationFrame(() => (lastGameItem || gameItems[0])?.focus({ preventScroll: true }));
    };

    const openGame = (item) => {
      const title = item.dataset.gameTitle || '游戏';
      const subtitle = item.dataset.gameSubtitle || '可即时试玩';
      const source = item.dataset.gameSrc || item.href;
      const path = item.dataset.gamePath || title.toLowerCase().replace(/\s+/g, '-');
      const repo = item.dataset.gameRepo || '';
      const reloadLabel = item.dataset.gameReloadLabel || '重新载入';
      const fullscreenLabel = item.dataset.gameFullscreenLabel || '全屏体验';
      const loadingLabel = item.dataset.gameLoading || '正在载入……';
      const loadingMark = item.dataset.gameLoadingIcon || '◆';
      const mobileMessage = item.dataset.gameMobileNote || '';
      lastGameItem = item;

      if (playerTitle) playerTitle.textContent = title.toUpperCase();
      if (playerSubtitle) playerSubtitle.textContent = subtitle;
      if (reload) reload.textContent = reloadLabel;
      if (fullscreen) {
        fullscreen.dataset.defaultLabel = fullscreenLabel;
        fullscreen.textContent = fullscreenLabel;
      }
      if (loadingText) loadingText.textContent = loadingLabel;
      if (loadingIcon) loadingIcon.textContent = loadingMark;
      if (mobileNote) {
        mobileNote.textContent = mobileMessage;
        mobileNote.hidden = !mobileMessage;
      }
      if (standalone) standalone.href = source;
      if (repository) {
        repository.hidden = !repo;
        if (repo) repository.href = repo;
      }
      player.setAttribute('aria-label', `${title} 互动体验`);
      frame.title = `${title} 互动体验`;
      frame.dataset.activeSrc = source;
      frame.dataset.loadingLabel = loadingLabel;
      if (frame.dataset.loaded !== source) {
        delete frame.dataset.readySrc;
        showLoadingState(loadingLabel);
        frame.src = source;
        frame.dataset.loaded = source;
      } else if (frame.dataset.readySrc === source) {
        clearLoadingTimer();
        if (loadingState) loadingState.hidden = true;
        frame.classList.add('is-ready');
      } else {
        showLoadingState(loadingLabel);
      }

      gameApp.dataset.view = 'player';
      library.hidden = true;
      library.inert = true;
      player.hidden = false;
      player.inert = false;
      syncGamePath(path);
      requestAnimationFrame(() => {
        notifyFrameVisibility(true);
        back?.focus({ preventScroll: true });
      });
      showToast(`${title} 已启动`);
    };

    gameItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openGame(item);
      });
    });

    back?.addEventListener('click', () => showLibrary());
    resetGameView = showLibrary;

    reload?.addEventListener('click', () => {
      const source = frame.dataset.activeSrc;
      if (!source) return;
      delete frame.dataset.readySrc;
      showLoadingState(frame.dataset.loadingLabel || '正在重新载入……');
      frame.src = source;
      const title = playerTitle?.textContent || '作品';
      showToast(`${title} 已重新载入`);
    });

    const syncFullscreenLabel = () => {
      if (!fullscreen) return;
      fullscreen.textContent = document.fullscreenElement ? '退出全屏' : (fullscreen.dataset.defaultLabel || '全屏体验');
    };

    fullscreen?.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await stage.requestFullscreen();
      } catch {
        window.open(frame.dataset.activeSrc || standalone?.href, '_blank', 'noopener,noreferrer');
      }
    });
    document.addEventListener('fullscreenchange', syncFullscreenLabel);
    showLibrary({ focus: false });
  };

  const bindSakuraPreview = () => {
    if (!sakuraWidget || !sakuraPreview) return;
    const loading = sakuraWidget.querySelector('[data-sakura-loading]');
    const targetOrigin = location.origin === 'null' ? '*' : location.origin;

    const notifyVisibility = (visible) => {
      if (!sakuraPreview.hasAttribute('src') || !sakuraPreview.contentWindow) return;
      try {
        sakuraPreview.contentWindow.postMessage({ type: 'xiahua:visibility', visible }, targetOrigin);
      } catch { /* A file preview can have an opaque origin; visual fallback remains available. */ }
    };

    syncSakuraPreviewVisibility = (requested) => {
      const visible = Boolean(requested && phase === 'desktop' && sakuraPreviewQuery.matches);
      sakuraWidget.classList.toggle('is-suspended', !visible);
      if (visible && !sakuraPreview.hasAttribute('src')) sakuraPreview.src = sakuraPreview.dataset.src;
      notifyVisibility(visible);
    };

    sakuraPreview.addEventListener('load', () => {
      notifyVisibility(phase === 'desktop' && sakuraPreviewQuery.matches && !desktop?.classList.contains('has-windows'));
    });
    window.addEventListener('message', (event) => {
      if (event.source !== sakuraPreview.contentWindow || event.origin !== location.origin || event.data?.type !== 'xiahua:sakura-ready') return;
      sakuraWidget.classList.add('is-ready');
      if (loading) loading.hidden = true;
    });
    sakuraPreviewQuery.addEventListener?.('change', () => syncSakuraPreviewVisibility(!desktop?.classList.contains('has-windows')));
  };

  const updateGithubData = async () => {
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch('https://api.github.com/users/ankhzw1876'),
        fetch('https://api.github.com/users/ankhzw1876/repos?per_page=100&sort=updated')
      ]);
      if (userResponse.ok) {
        const user = await userResponse.json();
        document.querySelectorAll('[data-repo-count]').forEach((node) => {
          node.textContent = node.closest('.boot-log') ? `${user.public_repos} repos` : String(user.public_repos);
        });
      }
      if (reposResponse.ok) {
        const repos = await reposResponse.json();
        const repoMap = new Map(repos.map((repo) => [repo.name, repo]));
        document.querySelectorAll('[data-repo]').forEach((row) => {
          const repo = repoMap.get(row.dataset.repo);
          if (!repo) return;
          row.querySelectorAll('[data-repo-stars]').forEach((node) => {
            node.textContent = String(repo.stargazers_count);
          });
        });
      }
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
  bindXhsCoverflow();
  bindCopyButtons();
  bindPortraitTilt();
  bindSakuraPreview();
  bindGamePlayer();
  bindGlobalEvents();
  updateClock();
  window.setInterval(updateClock, 1000);
  updateGithubData();
})();

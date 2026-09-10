(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const stage = $('#stage'), input = $('#urlInput'), status = $('#status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const themes = window.SakuraThemes;
  const worlds = {
    sakura: { label: '樱花树', loading: '正在长出一棵树', idle: '每个链接，都有自己的树形。' },
    islands: { label: '浮空群岛', loading: '正在升起一组岛屿', idle: '链接被藏进浮空群岛的地形里。' },
    moon: { label: '月球基地', loading: '正在搭建一座月球基地', idle: '月球基地已经收到这条坐标。' },
    library: { label: '微缩书城', loading: '正在摆好一座微缩书城', idle: '每个链接，都有一座自己的微缩书城。' },
  };
  let currentWorld = 'sakura';
  try {
    const savedWorld = localStorage.getItem('xiahua-qr-world');
    if (worlds[savedWorld]) currentWorld = savedWorld;
  } catch {}
  let canvas = $('#sceneCanvas');
  let renderer = null, identity = null, model = null, flat = false, fallback = false;
  let revision = 0, mountToken = 0, debounce = 0, statusTimer = 0, parentVisible = true, intersecting = true;
  let ready = false, currentUrl = '', lastError = '', disposed = false;
  let pointer = null;
  let orbitYaw = 0, orbitPitch = 0;
  let orbitReturn = null;
  const ORBIT_RETURN_MS = 480;

  function message(text, error = false) {
    clearTimeout(statusTimer);
    status.textContent = text; status.classList.toggle('error', error);
  }

  function normalized(value) {
    const raw = value.trim();
    if (!raw) throw new Error('先输入一个网页链接。');
    const hasHttp = /^https?:\/\//i.test(raw), hostPort = /^[^/?#\s]+:\d+(?:[/?#]|$)/.test(raw);
    if (!hasHttp && /^[a-z][a-z\d+.-]*:/i.test(raw) && !hostPort) throw new Error('请使用 http 或 https 网页链接。');
    let result;
    try { result = new URL(hasHttp ? raw : `https://${raw}`); }
    catch { throw new Error('链接还没写完整，再检查一下。'); }
    if (!['http:', 'https:'].includes(result.protocol) || result.username || result.password) throw new Error('请使用不含账号和密码的网页链接。');
    if (result.href.length > 1800) throw new Error('这个链接太长，试试短链接。');
    return result.href;
  }

  function syncView() {
    document.querySelectorAll('[data-palette]').forEach(button => {
      if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.palette === themes.current));
    });
    document.querySelectorAll('.world-tabs button[data-world]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.world === currentWorld));
      button.disabled = fallback;
    });
    const world = worlds[currentWorld];
    $('#treeView').setAttribute('aria-pressed', String(!flat));
    $('#treeView').textContent = world.label;
    $('#qrView').setAttribute('aria-pressed', String(flat));
    $('#treeView').disabled = fallback;
    $('#qrView').disabled = fallback;
    $('#loadingText').textContent = world.loading;
    stage.dataset.flat = String(flat);
    stage.dataset.world = currentWorld;
    stage.setAttribute('aria-label', fallback ? '可扫描的二维码' : flat ? `点击二维码，返回${world.label}` : `拖拽旋转${world.label}，轻点转为二维码`);
    stage.setAttribute('role', fallback ? 'img' : 'button');
    stage.tabIndex = fallback ? -1 : 0;
    $('#gestureHint').textContent = fallback ? '当前浏览器暂不支持此 3D 效果，已保留可扫描二维码。' : flat ? `扫码打开链接 · 轻点回到${world.label}` : '拖拽检视 · 松开复位 · 轻点切换';
    syncOrbitUi();
  }

  function setView(next, immediate = reduced.matches) {
    if (!ready || fallback) return;
    const active = cancelGesture();
    stopOrbitReturn(true);
    if (active && ((active.dragged && active.canRotate) || active.interruptedReturn)) setOrbit(0, 0);
    flat = next;
    renderer.setFlat(flat, { immediate });
    syncView();
    message(flat ? '镜头正在转向二维码……' : worlds[currentWorld].idle);
    if (flat) statusTimer = setTimeout(() => message('换一个俯视角，这个微缩世界就是同一条链接。'), immediate ? 0 : 1050);
  }

  function isVisible() { return parentVisible && intersecting && !document.hidden && !disposed; }
  function fitScene() {
    // Keep the tree large on the stage without cutting off the slab on narrow screens.
    renderer?.setZoom(stage.clientWidth / stage.clientHeight < .8 ? 1.12 : 1.4);
    renderer?.resize();
  }
  function syncVisibility() {
    if (isVisible()) renderer?.resume();
    else { endGesture(); stopOrbitReturn(true); renderer?.pause(); }
  }

  function syncOrbitUi() {
    $('#resetView').hidden = fallback;
    $('#resetView').disabled = !ready || flat || fallback || (Math.abs(orbitYaw) < .001 && Math.abs(orbitPitch) < .001);
  }
  function canOrbit() {
    // The scannable QR remains square; don't interrupt a camera morph with a drag.
    return ready && !fallback && !flat && Number(canvas.dataset.morphProgress || 0) === 0;
  }
  function setOrbit(yaw, pitch) {
    if (!ready || fallback) return;
    [orbitYaw, orbitPitch] = SakuraEngine.normalizeSeedOrbit(yaw, pitch);
    renderer?.setOrbit(orbitYaw, orbitPitch);
    syncOrbitUi();
  }
  function resetOrbit() {
    cancelGesture();
    stopOrbitReturn();
    setOrbit(0, 0);
    message('已回到初始视角。');
  }
  function stopOrbitReturn(snap = false) {
    const active = orbitReturn;
    orbitReturn = null;
    if (!active) return;
    cancelAnimationFrame(active.frame);
    if (snap) setOrbit(0, 0);
  }
  function returnOrbit() {
    stopOrbitReturn();
    if (!canOrbit() || !isVisible() || reduced.matches || (Math.abs(orbitYaw) < .001 && Math.abs(orbitPitch) < .001)) {
      setOrbit(0, 0);
      if (ready && !flat && !fallback) message('已回到初始视角。');
      return;
    }
    // Angles are already normalized to [-PI, PI], so this takes the short
    // route home even after several complete turns. A new press can interrupt.
    const active = { yaw: orbitYaw, pitch: orbitPitch, start: performance.now(), frame: 0 };
    orbitReturn = active;
    message('正在回到初始视角……');
    const step = now => {
      if (orbitReturn !== active) return;
      if (!canOrbit() || !isVisible() || reduced.matches) { stopOrbitReturn(true); return; }
      const progress = Math.min(1, Math.max(0, (now - active.start) / ORBIT_RETURN_MS));
      const remaining = (1 - progress) ** 3;
      setOrbit(progress === 1 ? 0 : active.yaw * remaining, progress === 1 ? 0 : active.pitch * remaining);
      if (progress === 1) {
        orbitReturn = null;
        if (status.textContent === '正在回到初始视角……') message('已回到初始视角。');
      } else active.frame = requestAnimationFrame(step);
    };
    active.frame = requestAnimationFrame(step);
  }
  function cancelGesture() {
    const active = pointer;
    pointer = null;
    stage.classList.remove('is-dragging');
    if (active && stage.hasPointerCapture(active.id)) stage.releasePointerCapture(active.id);
    return active;
  }
  function endGesture() {
    const active = cancelGesture();
    if (active && ((active.dragged && active.canRotate) || active.interruptedReturn)) returnOrbit();
  }

  function drawFallback() {
    if (!identity?.qr) return;
    const c = $('#fallbackCanvas'), ctx = c.getContext('2d');
    const ratio = Math.min(devicePixelRatio || 1, 2), matrix = identity.qr;
    c.width = Math.round(stage.clientWidth * ratio); c.height = Math.round(stage.clientHeight * ratio);
    const cell = Math.max(1, Math.floor(Math.min(c.width, c.height) * .84 / (matrix.size + 8)));
    const total = cell * (matrix.size + 8), x = Math.floor((c.width - total) / 2), y = Math.floor((c.height - total) / 2);
    ctx.fillStyle = themes.active.colors.bg; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, total, total);
    ctx.fillStyle = '#382f30';
    for (let r = 0; r < matrix.size; r++) for (let col = 0; col < matrix.size; col++) {
      if (matrix.cells[r * matrix.size + col]) ctx.fillRect(x + (col + 4) * cell, y + (r + 4) * cell, cell, cell);
    }
  }

  function useFallback(error) {
    cancelGesture();
    stopOrbitReturn();
    renderer?.dispose(); renderer = null;
    fallback = true; flat = true; ready = true;
    lastError = error instanceof Error ? error.message : String(error || 'WebGPU unavailable');
    canvas.hidden = true; $('#fallbackCanvas').hidden = false; $('#loading').hidden = true;
    syncView(); drawFallback();
    message('可用支持 WebGPU 的浏览器查看完整樱花效果。');
    window.__ready = true;
  }

  function legacyIdentity(url) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    const code = qrcode(0, 'M'); code.addData(url, 'Byte'); code.make();
    const size = code.getModuleCount();
    return { link: { payloadUrl: url }, qr: { size, cells: Uint8Array.from({ length: size * size }, (_, i) => Number(code.isDark(Math.floor(i / size), i % size))) } };
  }

  async function generate(raw, silent = false) {
    const request = ++revision;
    let url, nextIdentity, nextModel;
    try {
      url = normalized(raw);
      if (url === currentUrl && ready) { input.removeAttribute('aria-invalid'); if (!silent) message('这棵树已经属于这个链接。'); return; }
      if (!window.SakuraEngine) {
        nextIdentity = legacyIdentity(url);
      } else {
        nextIdentity = await SakuraEngine.createEveryQRCodeIdentity(url, { identityScope: 'url' });
        nextModel = await SakuraEngine.createSeedModel(nextIdentity, { generatorVersion: 1 });
      }
    } catch (error) {
      if (request !== revision) return;
      input.setAttribute('aria-invalid', 'true');
      const text = error?.code === 'link-too-complex' ? '链接超出了这版树形二维码的容量，请使用短链接。' : error instanceof Error && /[\u4e00-\u9fff]/.test(error.message) ? error.message : '暂时无法生成这条链接，请检查格式或使用短链接。';
      if (!silent) message(text, true);
      return;
    }
    if (request !== revision || disposed) return;
    input.removeAttribute('aria-invalid');
    const mount = ++mountToken;
    cancelGesture();
    stopOrbitReturn();
    renderer?.dispose(); renderer = null;
    identity = nextIdentity; model = nextModel; currentUrl = url;
    ready = false; fallback = false; flat = false; lastError = '';
    orbitYaw = 0; orbitPitch = 0;
    $('#fallbackCanvas').hidden = true;
    const fresh = canvas.cloneNode(); canvas.replaceWith(fresh); canvas = fresh; canvas.hidden = false;
    $('#loading').hidden = false; syncView(); message(`${worlds[currentWorld].loading}……`);
    if (!window.SakuraEngine || !navigator.gpu) { useFallback(new Error('WebGPU unavailable')); return; }
    try {
      renderer = SakuraEngine.mountSeed(canvas, model, themes.scene, 'tree', {
        world: currentWorld,
        onReady() {
          if (mount !== mountToken || disposed) return;
          ready = true; $('#loading').hidden = true;
          syncOrbitUi();
          fitScene();
          renderer?.setReducedMotion(reduced.matches);
          message(worlds[currentWorld].idle); syncVisibility();
          requestAnimationFrame(() => { window.__ready = true; });
        },
        onError(error) { if (mount === mountToken && !disposed) useFallback(error); }
      });
      syncVisibility();
    } catch (error) { useFallback(error); }
  }

  function setPalette(key) {
    if (!themes.apply(key)) return;
    renderer?.setScene(themes.scene);
    if (fallback) drawFallback();
    syncView();
    message(`已切换为「${themes.active.name}」配色。`);
  }
  function setWorld(key) {
    if (!worlds[key] || key === currentWorld) return;
    cancelGesture();
    stopOrbitReturn(true);
    currentWorld = key;
    try { localStorage.setItem('xiahua-qr-world', key); } catch {}
    renderer?.setWorld(key);
    if (flat && ready && !fallback) {
      flat = false;
      renderer?.setFlat(false, { immediate: reduced.matches });
    }
    syncView();
    message(worlds[key].idle);
  }
  document.querySelectorAll('.palette-tabs button').forEach(button => {
    button.addEventListener('click', () => setPalette(button.dataset.palette));
  });
  document.querySelectorAll('.world-tabs button').forEach(button => {
    button.addEventListener('click', () => setWorld(button.dataset.world));
  });
  $('#urlForm').addEventListener('submit', event => { event.preventDefault(); clearTimeout(debounce); generate(input.value); });
  input.addEventListener('input', () => {
    clearTimeout(debounce); ++revision; input.removeAttribute('aria-invalid');
    debounce = setTimeout(() => generate(input.value, true), 650);
  });
  input.addEventListener('change', () => { clearTimeout(debounce); generate(input.value); });
  $('#treeView').addEventListener('click', () => setView(false));
  $('#qrView').addEventListener('click', () => setView(true));
  $('#resetView').addEventListener('click', resetOrbit);
  stage.addEventListener('pointerdown', e => {
    if (e.isPrimary === false || (pointer && pointer.id !== e.pointerId)) { endGesture(); return; }
    if (!ready || fallback || e.button !== 0) return;
    const interruptedReturn = Boolean(orbitReturn);
    stopOrbitReturn();
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: orbitYaw, pitch: orbitPitch, dragged: false, canRotate: canOrbit(), interruptedReturn };
    stage.setPointerCapture(e.pointerId);
    stage.focus({ preventScroll: true });
    e.preventDefault();
  });
  stage.addEventListener('pointermove', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) { endGesture(); return; }
    const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
    if (!pointer.dragged && Math.hypot(dx, dy) >= 6) {
      // Latch this even if the pointer later returns to its starting position.
      pointer.dragged = true;
      if (pointer.canRotate) {
        stage.classList.add('is-dragging');
        message('正在环绕检视 · 松开自动复位');
      }
    }
    if (pointer.dragged && pointer.canRotate && canOrbit()) {
      const turn = Math.PI * 2 / Math.max(320, stage.clientWidth * .8);
      setOrbit(pointer.yaw + dx * turn, pointer.pitch - dy * .0045);
    }
    e.preventDefault();
  });
  stage.addEventListener('pointerup', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const active = pointer, bounds = stage.getBoundingClientRect();
    const tap = !active.dragged && Math.hypot(e.clientX - active.x, e.clientY - active.y) < 6;
    endGesture();
    if (tap && e.clientX >= bounds.left && e.clientX <= bounds.right && e.clientY >= bounds.top && e.clientY <= bounds.bottom) setView(!flat);
  });
  stage.addEventListener('pointercancel', endGesture);
  stage.addEventListener('lostpointercapture', e => { if (pointer?.id === e.pointerId) endGesture(); });
  stage.addEventListener('dragstart', e => e.preventDefault());
  addEventListener('blur', endGesture);
  stage.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView(!flat); }
    if (e.key === 'Escape') setView(false);
    if (!canOrbit()) return;
    if (e.key.toLowerCase() === 'r') { e.preventDefault(); resetOrbit(); }
    const turns = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, .1], ArrowDown: [0, -.1] };
    if (turns[e.key]) {
      e.preventDefault(); cancelGesture();
      stopOrbitReturn();
      setOrbit(orbitYaw + turns[e.key][0], orbitPitch + turns[e.key][1]);
    }
  });
  new ResizeObserver(() => { fitScene(); if (fallback) drawFallback(); }).observe(stage);
  new IntersectionObserver(entries => { intersecting = entries[0]?.isIntersecting ?? true; syncVisibility(); }).observe(stage);
  document.addEventListener('visibilitychange', syncVisibility);
  addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'xiahua:visibility') return;
    parentVisible = event.data.visible !== false; syncVisibility();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) stopOrbitReturn(true);
    renderer?.setReducedMotion(reduced.matches);
    renderer?.setFlat(flat, { immediate: true });
  });
  addEventListener('pagehide', event => {
    endGesture(); stopOrbitReturn(true);
    clearTimeout(debounce); clearTimeout(statusTimer);
    if (event.persisted) renderer?.pause();
    else { disposed = true; renderer?.dispose(); }
  });
  addEventListener('pageshow', event => { if (event.persisted) syncVisibility(); });
  window.sakuraGarden = {
    get state() { return { ready, flat, fallback, palette: themes.current, world: currentWorld, orbit: { yaw: orbitYaw, pitch: orbitPitch, dragging: Boolean(pointer?.dragged), returning: Boolean(orbitReturn) }, url: currentUrl, qrSize: identity?.qr.size, visible: isVisible(), renderer: canvas.dataset.renderer, progress: Number(canvas.dataset.morphProgress || 0), lastError }; },
    get model() { return model; },
    get matrix() { return identity?.qr; },
    setView,
    setPalette,
    setWorld,
    resetOrbit
  };
  generate(input.value);
})();

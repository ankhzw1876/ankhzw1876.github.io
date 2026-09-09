(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const stage = $('#stage'), input = $('#urlInput'), status = $('#status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const background = [250 / 255, 247 / 255, 242 / 255];
  const palette = [[.91,.48,.64],[.20,.56,.08],[.91,.88,.79],[.31,.43,.18],[.965,.945,.906]];
  let canvas = $('#sceneCanvas');
  let renderer = null, identity = null, model = null, flat = false, fallback = false;
  let revision = 0, mountToken = 0, debounce = 0, statusTimer = 0, parentVisible = true, intersecting = true;
  let ready = false, currentUrl = '', lastError = '', disposed = false;
  let pointer = null;

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
    $('#treeView').setAttribute('aria-pressed', String(!flat));
    $('#qrView').setAttribute('aria-pressed', String(flat));
    $('#treeView').disabled = fallback;
    stage.setAttribute('aria-label', fallback ? '可扫描的二维码' : flat ? '点击二维码，返回樱花树' : '点击樱花树，转为二维码');
    stage.setAttribute('role', fallback ? 'img' : 'button');
    stage.tabIndex = fallback ? -1 : 0;
    $('#gestureHint').textContent = fallback ? '当前浏览器暂不支持此 3D 效果，已保留可扫描二维码。' : flat ? '扫码打开链接，或点一下回到樱花树。' : '点一下，换个视角。';
  }

  function setView(next, immediate = reduced.matches) {
    if (!ready || fallback) return;
    flat = next;
    renderer.setFlat(flat, { immediate });
    syncView();
    message(flat ? '镜头正在转向二维码……' : '每个链接，都有自己的树形。');
    if (flat) statusTimer = setTimeout(() => message('花、草与地面的颜色，组成同一个链接。'), immediate ? 0 : 1050);
  }

  function isVisible() { return parentVisible && intersecting && !document.hidden && !disposed; }
  function fitScene() {
    // Keep the tree large on the stage without cutting off the slab on narrow screens.
    renderer?.setZoom(stage.clientWidth / stage.clientHeight < .8 ? 1.12 : 1.4);
    renderer?.resize();
  }
  function syncVisibility() {
    if (isVisible()) renderer?.resume();
    else renderer?.pause();
  }

  function drawFallback() {
    if (!identity?.qr) return;
    const c = $('#fallbackCanvas'), ctx = c.getContext('2d');
    const ratio = Math.min(devicePixelRatio || 1, 2), matrix = identity.qr;
    c.width = Math.round(stage.clientWidth * ratio); c.height = Math.round(stage.clientHeight * ratio);
    const cell = Math.max(1, Math.floor(Math.min(c.width, c.height) * .84 / (matrix.size + 8)));
    const total = cell * (matrix.size + 8), x = Math.floor((c.width - total) / 2), y = Math.floor((c.height - total) / 2);
    ctx.fillStyle = '#faf7f2'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, total, total);
    ctx.fillStyle = '#382f30';
    for (let r = 0; r < matrix.size; r++) for (let col = 0; col < matrix.size; col++) {
      if (matrix.cells[r * matrix.size + col]) ctx.fillRect(x + (col + 4) * cell, y + (r + 4) * cell, cell, cell);
    }
  }

  function useFallback(error) {
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
    renderer?.dispose(); renderer = null;
    identity = nextIdentity; model = nextModel; currentUrl = url;
    ready = false; fallback = false; flat = false; lastError = '';
    $('#fallbackCanvas').hidden = true;
    const fresh = canvas.cloneNode(); canvas.replaceWith(fresh); canvas = fresh; canvas.hidden = false;
    $('#loading').hidden = false; syncView(); message('正在为这个链接长出一棵树……');
    if (!window.SakuraEngine || !navigator.gpu) { useFallback(new Error('WebGPU unavailable')); return; }
    try {
      renderer = SakuraEngine.mountSeed(canvas, model, { background, palette, effect: 'calm' }, 'tree', {
        onReady() {
          if (mount !== mountToken || disposed) return;
          ready = true; $('#loading').hidden = true;
          fitScene();
          renderer?.setReducedMotion(reduced.matches);
          message('每个链接，都有自己的树形。'); syncVisibility();
          requestAnimationFrame(() => { window.__ready = true; });
        },
        onError(error) { if (mount === mountToken && !disposed) useFallback(error); }
      });
      syncVisibility();
    } catch (error) { useFallback(error); }
  }

  $('#urlForm').addEventListener('submit', event => { event.preventDefault(); clearTimeout(debounce); generate(input.value); });
  input.addEventListener('input', () => {
    clearTimeout(debounce); ++revision; input.removeAttribute('aria-invalid');
    debounce = setTimeout(() => generate(input.value, true), 650);
  });
  input.addEventListener('change', () => { clearTimeout(debounce); generate(input.value); });
  $('#treeView').addEventListener('click', () => setView(false));
  $('#qrView').addEventListener('click', () => setView(true));
  stage.addEventListener('pointerdown', e => { pointer = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener('pointerup', e => {
    if (pointer && Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) < 10) setView(!flat);
    pointer = null;
  });
  stage.addEventListener('pointercancel', () => { pointer = null; });
  stage.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView(!flat); }
    if (e.key === 'Escape') setView(false);
  });
  new ResizeObserver(() => { fitScene(); if (fallback) drawFallback(); }).observe(stage);
  new IntersectionObserver(entries => { intersecting = entries[0]?.isIntersecting ?? true; syncVisibility(); }).observe(stage);
  document.addEventListener('visibilitychange', syncVisibility);
  addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'xiahua:visibility') return;
    parentVisible = event.data.visible !== false; syncVisibility();
  });
  reduced.addEventListener('change', () => {
    renderer?.setReducedMotion(reduced.matches);
    renderer?.setFlat(flat, { immediate: true });
  });
  addEventListener('pagehide', event => {
    clearTimeout(debounce); clearTimeout(statusTimer);
    if (event.persisted) renderer?.pause();
    else { disposed = true; renderer?.dispose(); }
  });
  addEventListener('pageshow', event => { if (event.persisted) syncVisibility(); });
  window.sakuraGarden = {
    get state() { return { ready, flat, fallback, url: currentUrl, qrSize: identity?.qr.size, visible: isVisible(), renderer: canvas.dataset.renderer, progress: Number(canvas.dataset.morphProgress || 0), lastError }; },
    get model() { return model; },
    get matrix() { return identity?.qr; },
    setView
  };
  generate(input.value);
})();

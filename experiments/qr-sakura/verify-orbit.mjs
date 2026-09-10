import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';

// Run the actual checked-in browser code. These tests cover input contracts;
// real WebGPU compilation, rendering and QR decoding remain browser checks.
const wrapper = await readFile(new URL('sakura.js', import.meta.url), 'utf8');
const bundle = await readFile(new URL('vendor/sakura-engine.js', import.meta.url), 'utf8');
let rafCount = 0;
const engineContext = {
  console: { ...console, error() {} }, URL, URLSearchParams, TextEncoder, TextDecoder,
  crypto: webcrypto, performance, navigator: {},
  requestAnimationFrame() { return ++rafCount; }, cancelAnimationFrame() {},
};
vm.runInNewContext(bundle, engineContext);
const engine = engineContext.SakuraEngine;
assert.equal(typeof engine.normalizeSeedOrbit, 'function', 'rebuild the browser bundle');
const close = (actual, expected, description) => assert.ok(Math.abs(actual - expected) < 1e-10, description);
for (const yaw of [-100 * Math.PI, -7, -Math.PI, 0, Math.PI, 8, 100 * Math.PI]) {
  const [normalized, pitch] = engine.normalizeSeedOrbit(yaw, 0);
  assert.ok(Number.isFinite(normalized) && Math.abs(normalized) <= Math.PI);
  close(Math.sin(normalized), Math.sin(yaw), 'yaw normalization preserves direction');
  close(Math.cos(normalized), Math.cos(yaw), 'yaw normalization preserves direction');
  assert.equal(pitch, 0);
}
assert.deepEqual(Array.from(engine.normalizeSeedOrbit(Infinity, NaN)), [0, 0]);
assert.deepEqual(Array.from(engine.normalizeSeedOrbit(NaN, Infinity)), [0, 0]);
assert.equal(engine.normalizeSeedOrbit(0, -100)[1], -.9);
assert.equal(engine.normalizeSeedOrbit(0, 100)[1], .35);

class EventSurface {
  handlers = new Map();
  addEventListener(type, handler) {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler); this.handlers.set(type, handlers);
  }
  emit(type, fields = {}) {
    const event = {
      type, pointerId: 1, isPrimary: true, pointerType: 'mouse', button: 0,
      buttons: type === 'pointerup' ? 0 : 1, clientX: 200, clientY: 200,
      defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...fields,
    };
    for (const handler of this.handlers.get(type) || []) handler(event);
    return event;
  }
}

function createHarness({ gpu = true, reducedMotion = false, missingBundle = false } = {}) {
  const elements = new Map(), renderers = [], rootEvents = new EventSurface();
  class Element extends EventSurface {
    constructor(id, tagName = 'DIV') {
      super(); this.id = id; this.tagName = tagName; this.dataset = {}; this.attributes = {};
      this.clientWidth = 800; this.clientHeight = 600; this.hidden = false; this.disabled = false;
      this.captures = new Set(); this.classes = new Set();
      this.classList = {
        add: key => this.classes.add(key), remove: key => this.classes.delete(key),
        toggle: (key, enabled) => enabled ? this.classes.add(key) : this.classes.delete(key),
      };
    }
    setAttribute(key, value) { this.attributes[key] = value; }
    removeAttribute(key) { delete this.attributes[key]; }
    focus() { this.focused = true; }
    setPointerCapture(id) { this.captures.add(id); }
    hasPointerCapture(id) { return this.captures.has(id); }
    releasePointerCapture(id) {
      this.captures.delete(id); this.emit('lostpointercapture', { pointerId: id });
    }
    getBoundingClientRect() { return { left: 0, top: 0, right: 800, bottom: 600 }; }
    cloneNode() { return new Element(this.id, this.tagName); }
    replaceWith(next) { elements.set(`#${this.id}`, next); }
    getContext() { return { fillRect() {} }; }
  }
  for (const id of ['stage', 'urlInput', 'status', 'sceneCanvas', 'fallbackCanvas', 'treeView', 'qrView', 'gestureHint', 'resetView', 'loading', 'urlForm']) {
    elements.set(`#${id}`, new Element(id));
  }
  const palettes = ['night', 'moon', 'spring'].map(key => {
    const element = new Element(key, 'BUTTON'); element.dataset.palette = key; return element;
  });
  const document = new EventSurface();
  document.hidden = false;
  document.querySelector = selector => {
    assert.ok(elements.has(selector), `mock DOM missing ${selector}`); return elements.get(selector);
  };
  document.querySelectorAll = () => palettes;
  elements.get('#urlInput').value = 'https://example.com/';
  const media = new EventSurface(); media.matches = reducedMotion;
  const themes = {
    current: 'night', active: { name: '测试', colors: { bg: '#fff' } }, scene: { effect: 'calm' },
    apply(key) { if (!palettes.some(element => element.dataset.palette === key)) return false; this.current = key; return true; },
  };
  const mockEngine = {
    normalizeSeedOrbit: engine.normalizeSeedOrbit,
    async createEveryQRCodeIdentity(url) { return { link: { payloadUrl: url }, qr: { size: 1, cells: [1] } }; },
    async createSeedModel(identity) { return { identity }; },
    mountSeed(canvas, model, scene, form, callbacks) {
      const renderer = {
        calls: [], disposed: false, paused: false,
        setOrbit(yaw, pitch) { this.orbit = [yaw, pitch]; this.calls.push(['orbit', yaw, pitch]); },
        setFlat(flat) { canvas.dataset.morphProgress = flat ? '1.000' : '0.000'; this.calls.push(['flat', flat]); },
        setZoom(zoom) { this.calls.push(['zoom', zoom]); }, resize() {},
        setReducedMotion(enabled) { this.reducedMotion = enabled; },
        setScene(next) { this.scene = next; }, pause() { this.paused = true; }, resume() { this.paused = false; },
        dispose() { this.disposed = true; }, fail(error) { callbacks.onError(error); },
      };
      canvas.dataset.renderer = 'webgpu-wgsl'; canvas.dataset.morphProgress = '0.000';
      renderers.push(renderer); queueMicrotask(callbacks.onReady); return renderer;
    },
  };
  const context = {
    console, URL, Error, Uint8Array, document, navigator: { gpu: gpu ? {} : undefined },
    devicePixelRatio: 1, location: { origin: 'https://example.com' },
    matchMedia() { return media; }, SakuraThemes: themes,
    addEventListener: rootEvents.addEventListener.bind(rootEvents),
    ResizeObserver: class { observe() {} }, IntersectionObserver: class { observe() {} },
    setTimeout() { return 1; }, clearTimeout() {}, requestAnimationFrame(callback) { callback(); return 1; },
  };
  if (!missingBundle) context.SakuraEngine = mockEngine;
  else {
    context.qrcode = () => ({ addData() {}, make() {}, getModuleCount() { return 1; }, isDark() { return true; } });
    context.qrcode.stringToBytesFuncs = { 'UTF-8': () => [] };
  }
  context.window = context; context.parent = {};
  vm.runInNewContext(wrapper, context, { filename: 'sakura.js' });
  return {
    context, document, media, rootEvents, renderers, palettes,
    get stage() { return elements.get('#stage'); }, get canvas() { return elements.get('#sceneCanvas'); },
    get api() { return context.sakuraGarden; }, get renderer() { return renderers.at(-1); },
    el: id => elements.get(`#${id}`),
  };
}
const flush = () => new Promise(resolve => setImmediate(resolve));
async function mount(options) { const harness = createHarness(options); await flush(); assert.ok(harness.api.state.ready); return harness; }
function tap(harness, fields = {}) { harness.stage.emit('pointerdown', fields); harness.stage.emit('pointerup', fields); }
function drag(harness, x = 330, y = 220) {
  harness.stage.emit('pointerdown'); harness.stage.emit('pointermove', { clientX: x, clientY: y });
  harness.stage.emit('pointerup', { clientX: x, clientY: y });
}
const angle = harness => [harness.api.state.orbit.yaw, harness.api.state.orbit.pitch];

const initializing = createHarness();
tap(initializing);
assert.equal(initializing.api.state.flat, false, 'ignore taps before initialization');
await flush();
assert.ok(initializing.api.state.ready);
assert.equal(initializing.el('resetView').disabled, true);

const click = await mount();
tap(click); assert.equal(click.api.state.flat, true, 'tap opens QR');
tap(click); assert.equal(click.api.state.flat, false, 'tap returns to tree');
drag(click);
assert.equal(click.api.state.flat, false, 'drag does not toggle QR');
assert.notEqual(angle(click)[0], 0);
assert.notEqual(angle(click)[1], 0);
assert.equal(click.stage.captures.size, 0);
assert.equal(click.stage.classes.has('is-dragging'), false);

const fullTurn = await mount();
drag(fullTurn, 200 + fullTurn.stage.clientWidth * .8, 200);
close(angle(fullTurn)[0], 0, 'a full-width orbit completes a continuous 360-degree turn');
assert.equal(fullTurn.api.state.flat, false, 'a full turn ending at the same orientation is still a drag');
drag(fullTurn, 200, -1000); assert.equal(angle(fullTurn)[1], -.9);
drag(fullTurn, 200, 1200); assert.equal(angle(fullTurn)[1], .35);

const roundTrip = await mount();
roundTrip.stage.emit('pointerdown');
roundTrip.stage.emit('pointermove', { clientX: 360 });
roundTrip.stage.emit('pointermove', { clientX: 200 });
roundTrip.stage.emit('pointerup');
assert.equal(roundTrip.api.state.flat, false, 'returning to origin after dragging is never a tap');

for (const cancel of ['pointercancel', 'lostpointercapture', 'blur', 'buttons-lost']) {
  const harness = await mount();
  harness.stage.emit('pointerdown'); harness.stage.emit('pointermove', { clientX: 360 });
  if (cancel === 'blur') harness.rootEvents.emit('blur');
  else if (cancel === 'buttons-lost') harness.stage.emit('pointermove', { clientX: 360, buttons: 0 });
  else harness.stage.emit(cancel);
  const saved = angle(harness);
  harness.stage.emit('pointermove', { clientX: 400 }); harness.stage.emit('pointerup');
  assert.deepEqual(angle(harness), saved, `${cancel} ends rotation`);
  assert.equal(harness.api.state.flat, false, `${cancel} does not leave a latent tap`);
  assert.equal(harness.stage.classes.has('is-dragging'), false);
}

const outside = await mount();
outside.stage.emit('pointerdown', { clientX: 799 });
outside.stage.emit('pointerup', { clientX: 802 });
assert.equal(outside.api.state.flat, false, 'a tiny movement released outside the stage is not a tap');
outside.stage.emit('pointerdown');
outside.stage.emit('pointermove', { clientX: 1000 });
outside.stage.emit('pointerup', { clientX: 1000 });
assert.equal(outside.stage.captures.size, 0, 'captured off-stage drag releases cleanly');

const alternate = await mount();
tap(alternate, { button: 2, buttons: 2 });
assert.equal(alternate.api.state.flat, false, 'right click is not a toggle');
alternate.stage.emit('pointerdown', { pointerType: 'touch' });
alternate.stage.emit('pointerdown', { pointerId: 2, pointerType: 'touch', isPrimary: false });
alternate.stage.emit('pointermove', { clientX: 400, pointerType: 'touch' });
alternate.stage.emit('pointerup', { pointerType: 'touch' });
alternate.stage.emit('pointerup', { pointerId: 2, pointerType: 'touch', isPrimary: false });
assert.equal(alternate.api.state.flat, false, 'a second finger cancels the tap/drag');
assert.deepEqual(angle(alternate), [0, 0]);
assert.equal(alternate.stage.captures.size, 0);
alternate.stage.emit('pointerdown', { pointerType: 'touch' });
alternate.stage.emit('pointermove', { pointerType: 'touch', clientX: 330 });
alternate.stage.emit('pointerup', { pointerType: 'touch', clientX: 330 });
assert.notEqual(angle(alternate)[0], 0, 'single-finger touch rotates');
assert.equal(alternate.api.state.flat, false);

const locked = await mount();
drag(locked); const lockedAngle = angle(locked);
locked.api.setView(true); drag(locked);
locked.stage.emit('keydown', { key: 'ArrowRight' });
assert.deepEqual(angle(locked), lockedAngle, 'QR mode locks drag and arrow rotation');
assert.equal(locked.api.state.flat, true);
locked.api.setView(false);
locked.canvas.dataset.morphProgress = '.250'; drag(locked);
assert.deepEqual(angle(locked), lockedAngle, 'camera morph cannot be interrupted by a drag');
locked.canvas.dataset.morphProgress = '0.000';
locked.stage.emit('keydown', { key: 'ArrowRight' });
assert.notEqual(angle(locked)[0], lockedAngle[0], 'arrows rotate after the morph settles');

const keyboard = await mount();
const arrow = keyboard.stage.emit('keydown', { key: 'ArrowRight' });
assert.ok(arrow.defaultPrevented, 'arrows do not scroll the page');
close(angle(keyboard)[0], .15);
keyboard.stage.emit('keydown', { key: 'ArrowUp' }); close(angle(keyboard)[1], -.1);
keyboard.stage.emit('keydown', { key: 'R' }); assert.deepEqual(angle(keyboard), [0, 0]);
drag(keyboard); keyboard.el('resetView').emit('click'); assert.deepEqual(angle(keyboard), [0, 0]);
keyboard.stage.emit('keydown', { key: 'Enter' }); assert.equal(keyboard.api.state.flat, true);
keyboard.stage.emit('keydown', { key: 'Escape' }); assert.equal(keyboard.api.state.flat, false);

const palette = await mount();
drag(palette); const beforePalette = angle(palette);
palette.api.setPalette('moon');
assert.deepEqual(angle(palette), beforePalette, 'palette changes preserve orbit');
assert.equal(palette.api.state.palette, 'moon');
assert.equal(palette.renderer.scene.effect, 'calm', 'rotation/palette changes do not enable particles');

const lifecycle = await mount({ reducedMotion: true });
drag(lifecycle);
assert.ok(lifecycle.renderer.reducedMotion);
assert.notEqual(angle(lifecycle)[0], 0, 'reduced motion still allows direct manipulation');
lifecycle.stage.emit('pointerdown'); lifecycle.stage.emit('pointermove', { clientX: 400 });
lifecycle.document.hidden = true; lifecycle.document.emit('visibilitychange');
assert.ok(lifecycle.renderer.paused); assert.equal(lifecycle.stage.captures.size, 0);
lifecycle.document.hidden = false; lifecycle.document.emit('visibilitychange');
assert.equal(lifecycle.renderer.paused, false);
lifecycle.stage.emit('pointerup'); assert.equal(lifecycle.api.state.flat, false);
const oldRenderer = lifecycle.renderer;
lifecycle.stage.emit('pointerdown');
lifecycle.el('urlInput').value = 'https://example.org/new-tree'; lifecycle.el('urlInput').emit('change');
await flush();
assert.ok(oldRenderer.disposed); assert.notEqual(lifecycle.renderer, oldRenderer);
assert.deepEqual(angle(lifecycle), [0, 0], 'new URLs start with the default camera');
assert.equal(lifecycle.stage.captures.size, 0);
lifecycle.stage.emit('pointerup'); assert.equal(lifecycle.api.state.flat, false);
lifecycle.renderer.fail(new Error('device lost'));
assert.ok(lifecycle.api.state.fallback); assert.ok(lifecycle.el('resetView').hidden);
drag(lifecycle); assert.ok(lifecycle.api.state.flat);

for (const options of [{ gpu: false }, { missingBundle: true }]) {
  const fallback = await mount(options);
  assert.ok(fallback.api.state.fallback); assert.ok(fallback.api.state.flat);
  assert.ok(fallback.el('resetView').hidden); assert.equal(fallback.stage.tabIndex, -1);
  drag(fallback); tap(fallback); assert.ok(fallback.api.state.flat);
  assert.equal(fallback.stage.captures.size, 0);
}

// The actual engine exposes safe camera controls before GPU setup and after disposal.
const noGpuCanvas = { dataset: {} };
let gpuError;
const actualRenderer = engine.mountSeed(noGpuCanvas, {}, {}, 'tree', { paused: true, onError(error) { gpuError = error; } });
assert.equal(typeof actualRenderer.setOrbit, 'function');
actualRenderer.setOrbit(7, -100);
actualRenderer.setReducedMotion(true);
actualRenderer.setFlat(true, { immediate: true });
actualRenderer.pause(); actualRenderer.resume();
await flush();
assert.match(gpuError.message, /WebGPU/);
assert.equal(rafCount, 0, 'unavailable GPU never schedules a render loop');
actualRenderer.dispose(); actualRenderer.setOrbit(NaN, Infinity);

console.log('PASS orbit normalization, tap/drag separation, return-drag latch, capture cancellation, off-stage release, mouse/touch/multitouch, QR/morph locks, keyboard/reset, palette persistence, reduced-motion input, lifecycle/fallback and real no-GPU renderer API.');

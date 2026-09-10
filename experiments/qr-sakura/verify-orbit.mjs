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

function createHarness({ gpu = true, reducedMotion = false, missingBundle = false, search = '' } = {}) {
  const elements = new Map(), renderers = [], rootEvents = new EventSurface();
  let now = 0, nextFrameId = 0;
  const frames = new Map();
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
  for (const id of ['stage', 'urlInput', 'status', 'sceneCanvas', 'fallbackCanvas', 'exactQrImage', 'treeView', 'qrView', 'gestureHint', 'resetView', 'loading', 'loadingText', 'urlForm']) {
    elements.set(`#${id}`, new Element(id));
  }
  elements.get('#exactQrImage').hidden = true;
  const palettes = ['night', 'moon', 'spring'].map(key => {
    const element = new Element(key, 'BUTTON'); element.dataset.palette = key; return element;
  });
  const worlds = ['sakura', 'islands', 'moon', 'library'].map(key => {
    const element = new Element(key, 'BUTTON'); element.dataset.world = key; return element;
  });
  const document = new EventSurface();
  document.hidden = false;
  document.querySelector = selector => {
    assert.ok(elements.has(selector), `mock DOM missing ${selector}`); return elements.get(selector);
  };
  document.querySelectorAll = selector => {
    if (selector.includes('palette')) return palettes;
    if (selector.includes('world')) return worlds;
    return [];
  };
  elements.get('#urlInput').value = 'https://example.com/';
  const media = new EventSurface(); media.matches = reducedMotion;
  const launchPalette = new URLSearchParams(search).get('palette');
  const themes = {
    current: ['night', 'moon', 'spring'].includes(launchPalette) ? launchPalette : 'night', active: { name: '测试', colors: { bg: '#fff' } }, scene: { effect: 'calm' },
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
        setWorld(world) { this.world = world; this.calls.push(['world', world]); },
        setScene(next) { this.scene = next; }, pause() { this.paused = true; }, resume() { this.paused = false; },
        dispose() { this.disposed = true; }, fail(error) { callbacks.onError(error); },
      };
      canvas.dataset.renderer = 'webgpu-wgsl'; canvas.dataset.morphProgress = '0.000';
      renderer.world = callbacks.world || 'sakura';
      renderers.push(renderer); queueMicrotask(callbacks.onReady); return renderer;
    },
  };
  const context = {
    console, URL, URLSearchParams, Error, Uint8Array, document, navigator: { gpu: gpu ? {} : undefined },
    devicePixelRatio: 1, location: { origin: 'https://example.com', search },
    matchMedia() { return media; }, SakuraThemes: themes,
    addEventListener: rootEvents.addEventListener.bind(rootEvents),
    ResizeObserver: class { observe() {} }, IntersectionObserver: class { observe() {} },
    performance: { now: () => now },
    setTimeout() { return 1; }, clearTimeout() {},
    localStorage: { values: new Map(), getItem(key) { return this.values.get(key) ?? null; }, setItem(key, value) { this.values.set(key, String(value)); } },
    requestAnimationFrame(callback) { const id = ++nextFrameId; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  if (!missingBundle) context.SakuraEngine = mockEngine;
  else {
    context.qrcode = () => ({ addData() {}, make() {}, getModuleCount() { return 1; }, isDark() { return true; } });
    context.qrcode.stringToBytesFuncs = { 'UTF-8': () => [] };
  }
  const parentMessages = [];
  context.window = context;
  context.parent = { postMessage(message, targetOrigin) { parentMessages.push({ message, targetOrigin }); } };
  vm.runInNewContext(wrapper, context, { filename: 'sakura.js' });
  return {
    context, document, media, rootEvents, renderers, palettes, worlds, parentMessages,
    get pendingFrames() { return [...frames.values()]; },
    advance(ms) {
      now += ms;
      const batch = [...frames.values()]; frames.clear();
      for (const callback of batch) callback(now);
    },
    get stage() { return elements.get('#stage'); }, get canvas() { return elements.get('#sceneCanvas'); },
    get api() { return context.sakuraGarden; }, get renderer() { return renderers.at(-1); },
    el: id => elements.get(`#${id}`),
  };
}
const flush = () => new Promise(resolve => setImmediate(resolve));
async function mount(options) { const harness = createHarness(options); await flush(); assert.ok(harness.api.state.ready); harness.advance(0); return harness; }
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

const embeddedPreset = await mount({ search: '?embed=1&world=library' });
assert.equal(embeddedPreset.api.state.world, 'library', 'launch world overrides the default before the first mount');
const embeddedReceipt = embeddedPreset.parentMessages.at(-1);
assert.equal(embeddedReceipt?.message?.type, 'xiahua:sakura-ready');
assert.equal(embeddedReceipt?.message?.world, 'library');
assert.equal(embeddedReceipt?.message?.palette, 'night');
assert.equal(embeddedReceipt?.targetOrigin, 'https://example.com', 'embedded preview reports readiness to its same-origin parent');

const profilePreset = await mount({ search: '?embed=1&palette=spring&world=sakura&qr=profile' });
assert.equal(profilePreset.api.state.exactQr, true, 'the internal warm-spring launch enables the exact QR preset');
assert.equal(profilePreset.api.state.url, 'http://weixin.qq.com/r/mp/9RM9JQPEX14grUdG90bn');
assert.equal(profilePreset.el('urlInput').value, profilePreset.api.state.url, 'the generated tree and supplied QR encode the same target');
assert.equal(profilePreset.el('exactQrImage').src, '../../assets/qr/warm-spring-profile-qr.jpg');
assert.equal(profilePreset.el('exactQrImage').hidden, false);
assert.equal(profilePreset.api.state.exactQrVisible, false, 'the exact image stays hidden in tree view');
profilePreset.el('exactQrImage').emit('load');
tap(profilePreset);
assert.equal(profilePreset.api.state.exactQrVisible, false, 'the generated morph reaches its final QR before the exact image appears');
profilePreset.advance(0);
assert.equal(profilePreset.api.state.exactQrVisible, true);
tap(profilePreset);
assert.equal(profilePreset.api.state.exactQrVisible, false, 'returning to the tree removes the exact QR immediately');

for (const search of [
  '?palette=spring&world=sakura&qr=profile',
  '?embed=1&palette=night&world=sakura&qr=profile',
  '?embed=1&palette=spring&world=library&qr=profile',
  '?embed=1&palette=spring&world=sakura&qr=../../secret',
  '?embed=1&palette=spring&world=sakura&qr=__proto__',
]) {
  const ignored = await mount({ search });
  assert.equal(ignored.api.state.exactQr, false, `ignore unsupported exact-QR launch contract: ${search}`);
  assert.equal(ignored.el('urlInput').value, 'https://example.com/');
}

const pausedProfile = await mount({ search: '?embed=1&palette=spring&world=sakura&qr=profile' });
pausedProfile.el('exactQrImage').emit('load');
pausedProfile.api.setView(true);
pausedProfile.rootEvents.emit('message', { source: pausedProfile.context.parent, origin: 'https://example.com', data: { type: 'xiahua:visibility', visible: false } });
pausedProfile.advance(0);
assert.equal(pausedProfile.api.state.exactQrVisible, false, 'a hidden parent cannot reveal the exact QR on a stale frame');
pausedProfile.rootEvents.emit('message', { source: pausedProfile.context.parent, origin: 'https://example.com', data: { type: 'xiahua:visibility', visible: true } });
pausedProfile.advance(0);
assert.equal(pausedProfile.api.state.exactQrVisible, true, 'restoring the parent resumes the final handoff');

const fallbackProfile = await mount({ gpu: false, search: '?embed=1&palette=spring&world=sakura&qr=profile' });
fallbackProfile.el('exactQrImage').emit('load');
assert.equal(fallbackProfile.api.state.exactQrVisible, true, 'unsupported WebGPU falls back to the supplied scannable QR');

const click = await mount();
tap(click); assert.equal(click.api.state.flat, true, 'tap opens QR');
tap(click); assert.equal(click.api.state.flat, false, 'tap returns to tree');
drag(click);
assert.equal(click.api.state.flat, false, 'drag does not toggle QR');
assert.notEqual(angle(click)[0], 0);
assert.notEqual(angle(click)[1], 0);
assert.equal(click.stage.captures.size, 0);
assert.equal(click.stage.classes.has('is-dragging'), false);
assert.ok(click.api.state.orbit.returning, 'release starts a return animation');
const releasedAngle = angle(click);
click.advance(240);
close(angle(click)[0], releasedAngle[0] / 8, 'yaw eases back along the shortest normalized path');
close(angle(click)[1], releasedAngle[1] / 8, 'pitch eases back with the same timing');
assert.ok(click.api.state.orbit.returning);
click.advance(240);
assert.deepEqual(angle(click), [0, 0], 'return completes at the exact default orientation');
assert.equal(click.api.state.orbit.returning, false);
assert.equal(click.pendingFrames.length, 0, 'finished return does not leave an animation loop');
assert.equal(click.el('resetView').disabled, true);

const interrupted = await mount();
drag(interrupted, 510, 235);
interrupted.advance(160);
const interruptedAngle = angle(interrupted), staleReturn = interrupted.pendingFrames[0];
interrupted.stage.emit('pointerdown');
assert.equal(interrupted.api.state.orbit.returning, false, 'new press interrupts the return');
assert.deepEqual(angle(interrupted), interruptedAngle, 'interruption does not snap the camera');
staleReturn(2000);
assert.deepEqual(angle(interrupted), interruptedAngle, 'a canceled stale frame cannot change the camera');
interrupted.stage.emit('pointermove', { clientX: 216, clientY: 190 });
close(angle(interrupted)[0], interruptedAngle[0] + 16 * Math.PI * 2 / 640);
close(angle(interrupted)[1], interruptedAngle[1] + .045, 'next drag starts at the interrupted angle');
interrupted.stage.emit('pointerup', { clientX: 216, clientY: 190 });
assert.ok(interrupted.api.state.orbit.returning);
interrupted.advance(480);
assert.deepEqual(angle(interrupted), [0, 0]);

for (const end of ['pointercancel', 'lostpointercapture', 'outside-release', 'tap']) {
  const harness = await mount(); drag(harness); harness.advance(120);
  harness.stage.emit('pointerdown', { clientX: 799 });
  assert.equal(harness.api.state.orbit.returning, false, `${end}: press holds the interrupted angle`);
  if (end === 'outside-release') harness.stage.emit('pointerup', { clientX: 802 });
  else if (end === 'tap') harness.stage.emit('pointerup', { clientX: 799 });
  else harness.stage.emit(end);
  if (end === 'tap') {
    assert.equal(harness.api.state.flat, true, 'a tap during return can still open the QR');
    assert.deepEqual(angle(harness), [0, 0]);
    assert.equal(harness.api.state.orbit.returning, false);
  } else {
    assert.ok(harness.api.state.orbit.returning, `${end}: resume return even when the interrupted press never becomes a drag`);
    harness.advance(480); assert.deepEqual(angle(harness), [0, 0]);
    assert.equal(harness.api.state.flat, false);
  }
}

const shortest = await mount();
drag(shortest, 200 + 640 * 3.75, 200);
close(angle(shortest)[0], -Math.PI / 2, 'several complete turns retain only their normalized orientation');
shortest.advance(240);
close(angle(shortest)[0], -Math.PI / 16, 'return takes the short negative-yaw route instead of unwinding turns');
shortest.advance(240);
assert.deepEqual(angle(shortest), [0, 0]);

const fullTurn = await mount();
drag(fullTurn, 200 + fullTurn.stage.clientWidth * .8, 200);
close(angle(fullTurn)[0], 0, 'a full-width orbit completes a continuous 360-degree turn');
assert.equal(fullTurn.api.state.flat, false, 'a full turn ending at the same orientation is still a drag');
assert.equal(fullTurn.api.state.orbit.returning, false, 'an already centered full turn needs no return animation');
drag(fullTurn, 200, -1000); assert.equal(angle(fullTurn)[1], .35, 'upward drag now increases pitch');
fullTurn.advance(480);
drag(fullTurn, 200, 1200); assert.equal(angle(fullTurn)[1], -.9, 'downward drag now decreases pitch');
fullTurn.advance(480);

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
  assert.ok(harness.api.state.orbit.returning, `${cancel} returns the released camera`);
  harness.advance(480);
  assert.deepEqual(angle(harness), [0, 0]);
}

const outside = await mount();
outside.stage.emit('pointerdown', { clientX: 799 });
outside.stage.emit('pointerup', { clientX: 802 });
assert.equal(outside.api.state.flat, false, 'a tiny movement released outside the stage is not a tap');
outside.stage.emit('pointerdown');
outside.stage.emit('pointermove', { clientX: 1000 });
outside.stage.emit('pointerup', { clientX: 1000 });
assert.equal(outside.stage.captures.size, 0, 'captured off-stage drag releases cleanly');
assert.ok(outside.api.state.orbit.returning, 'release outside the stage still starts automatic reset');
outside.advance(480); assert.deepEqual(angle(outside), [0, 0]);

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
assert.ok(alternate.api.state.orbit.returning, 'touch release has the same return behavior as mouse release');
alternate.advance(480); assert.deepEqual(angle(alternate), [0, 0]);

const locked = await mount();
drag(locked); const beforeQrFrame = locked.pendingFrames[0];
locked.api.setView(true); const lockedAngle = angle(locked); drag(locked);
assert.deepEqual(lockedAngle, [0, 0], 'QR mode finishes a pending return before starting its camera morph');
beforeQrFrame(2000); assert.deepEqual(angle(locked), [0, 0], 'a stale return cannot change QR mode');
assert.equal(locked.api.state.orbit.returning, false);
locked.stage.emit('keydown', { key: 'ArrowRight' });
assert.deepEqual(angle(locked), lockedAngle, 'QR mode locks drag and arrow rotation');
assert.equal(locked.api.state.flat, true);
locked.api.setView(false);
locked.canvas.dataset.morphProgress = '.250'; drag(locked);
assert.deepEqual(angle(locked), lockedAngle, 'camera morph cannot be interrupted by a drag');
locked.canvas.dataset.morphProgress = '0.000';
locked.stage.emit('keydown', { key: 'ArrowRight' });
assert.notEqual(angle(locked)[0], lockedAngle[0], 'arrows rotate after the morph settles');
locked.stage.emit('pointerdown'); locked.stage.emit('pointermove', { clientX: 380 });
locked.api.setView(true);
assert.deepEqual(angle(locked), [0, 0], 'changing view during an active drag snaps to the initial angle');
assert.equal(locked.stage.captures.size, 0);

const morphDuringReturn = await mount();
drag(morphDuringReturn);
morphDuringReturn.canvas.dataset.morphProgress = '.250';
morphDuringReturn.advance(16);
assert.deepEqual(angle(morphDuringReturn), [0, 0], 'return cannot fight an unexpected camera morph');
assert.equal(morphDuringReturn.api.state.orbit.returning, false);

const keyboard = await mount();
const arrow = keyboard.stage.emit('keydown', { key: 'ArrowRight' });
assert.ok(arrow.defaultPrevented, 'arrows do not scroll the page');
close(angle(keyboard)[0], .15);
keyboard.stage.emit('keydown', { key: 'ArrowUp' }); close(angle(keyboard)[1], .1);
keyboard.stage.emit('keydown', { key: 'ArrowDown' }); close(angle(keyboard)[1], 0);
keyboard.stage.emit('keydown', { key: 'R' }); assert.deepEqual(angle(keyboard), [0, 0]);
drag(keyboard); const beforeManualResetFrame = keyboard.pendingFrames[0];
keyboard.el('resetView').emit('click'); assert.deepEqual(angle(keyboard), [0, 0]);
assert.equal(keyboard.api.state.orbit.returning, false);
beforeManualResetFrame(2000); assert.deepEqual(angle(keyboard), [0, 0], 'manual reset cancels old return frames');
keyboard.stage.emit('keydown', { key: 'Enter' }); assert.equal(keyboard.api.state.flat, true);
keyboard.stage.emit('keydown', { key: 'Escape' }); assert.equal(keyboard.api.state.flat, false);

const palette = await mount();
drag(palette); const beforePalette = angle(palette);
const paletteModel = palette.api.model, paletteRenderer = palette.renderer;
palette.api.setPalette('moon');
assert.deepEqual(angle(palette), beforePalette, 'palette changes preserve orbit');
assert.equal(palette.api.model, paletteModel); assert.equal(palette.renderer, paletteRenderer);
assert.ok(palette.api.state.orbit.returning, 'palette changes preserve an in-progress return');
assert.equal(palette.api.state.palette, 'moon');
assert.equal(palette.renderer.scene.effect, 'calm', 'rotation/palette changes do not enable particles');
palette.advance(480); assert.deepEqual(angle(palette), [0, 0]);

const world = await mount();
const worldModel = world.api.model, worldMatrix = world.api.matrix, worldRenderer = world.renderer;
world.api.setPalette('spring');
world.worlds.find(button => button.dataset.world === 'islands').emit('click');
assert.equal(world.api.state.world, 'islands', 'one world-chip click changes the active world');
assert.equal(world.renderer, worldRenderer, 'world changes reuse the active WebGPU renderer');
assert.equal(world.api.model, worldModel, 'world changes do not regenerate the seed model');
assert.equal(world.api.matrix, worldMatrix, 'world changes preserve the exact QR matrix');
assert.equal(world.api.state.palette, 'spring', 'world changes preserve the selected palette');
assert.deepEqual(world.renderer.calls.at(-1), ['world', 'islands']);
world.api.setView(true);
assert.equal(world.api.state.flat, true);
world.worlds.find(button => button.dataset.world === 'library').emit('click');
assert.equal(world.api.state.world, 'library');
assert.equal(world.api.state.flat, false, 'choosing a world from QR view returns to its model view');
assert.ok(world.renderer.calls.some(call => call[0] === 'world' && call[1] === 'library'));
drag(world);
assert.ok(world.api.state.orbit.returning, 'a newly selected world keeps the shared drag and return behavior');
world.advance(480); assert.deepEqual(angle(world), [0, 0]);

const lifecycle = await mount({ reducedMotion: true });
lifecycle.stage.emit('pointerdown'); lifecycle.stage.emit('pointermove', { clientX: 330, clientY: 220 });
assert.ok(lifecycle.renderer.reducedMotion);
assert.notEqual(angle(lifecycle)[0], 0, 'reduced motion still allows direct manipulation');
lifecycle.stage.emit('pointerup', { clientX: 330, clientY: 220 });
assert.deepEqual(angle(lifecycle), [0, 0], 'reduced motion resets immediately on release');
assert.equal(lifecycle.api.state.orbit.returning, false);
assert.equal(lifecycle.pendingFrames.length, 0, 'reduced motion does not start a return animation');
lifecycle.stage.emit('pointerdown'); lifecycle.stage.emit('pointermove', { clientX: 400 });
lifecycle.document.hidden = true; lifecycle.document.emit('visibilitychange');
assert.ok(lifecycle.renderer.paused); assert.equal(lifecycle.stage.captures.size, 0);
assert.deepEqual(angle(lifecycle), [0, 0], 'hiding the document resets an active drag immediately');
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

for (const reason of ['hidden', 'parent-hidden', 'pagehide', 'persisted-pagehide', 'reduced-motion', 'regenerate', 'fallback']) {
  const harness = await mount(); drag(harness); harness.advance(120);
  const staleFrame = harness.pendingFrames[0], old = harness.renderer;
  if (reason === 'hidden') { harness.document.hidden = true; harness.document.emit('visibilitychange'); }
  if (reason === 'parent-hidden') harness.rootEvents.emit('message', { source: harness.context.parent, origin: 'https://example.com', data: { type: 'xiahua:visibility', visible: false } });
  if (reason === 'pagehide' || reason === 'persisted-pagehide') harness.rootEvents.emit('pagehide', { persisted: reason === 'persisted-pagehide' });
  if (reason === 'reduced-motion') { harness.media.matches = true; harness.media.emit('change'); }
  if (reason === 'regenerate') {
    harness.el('urlInput').value = 'https://example.org/regenerated'; harness.el('urlInput').emit('change');
    await flush();
  }
  if (reason === 'fallback') harness.renderer.fail(new Error('device lost during return'));
  assert.equal(harness.api.state.orbit.returning, false, `${reason} cancels the return loop`);
  if (reason !== 'fallback') assert.deepEqual(angle(harness), [0, 0], `${reason} starts from the default camera`);
  const savedAngle = angle(harness), calls = old.calls.length;
  staleFrame(2000);
  assert.deepEqual(angle(harness), savedAngle, `${reason} ignores a stale return callback`);
  assert.equal(old.calls.length, calls, `${reason} never writes an obsolete frame into its old renderer`);
  if (reason === 'pagehide' || reason === 'regenerate' || reason === 'fallback') assert.ok(old.disposed);
  if (reason === 'persisted-pagehide') {
    assert.ok(old.paused);
    harness.rootEvents.emit('pageshow', { persisted: true }); assert.equal(old.paused, false);
  }
}

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

console.log('PASS orbit normalization, corrected pitch direction, eased auto-return, shortest-path reset, interruption/stale-frame guards, tap/drag latch, capture cancellation, off-stage release, mouse/touch/multitouch, QR/morph locks, keyboard/reset, palette persistence, reduced-motion input, lifecycle/fallback and real no-GPU renderer API.');

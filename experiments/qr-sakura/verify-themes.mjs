import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('themes.js', import.meta.url), 'utf8');
function mount(saved, blocked = false) {
  const tokens = {}, storage = new Map([['xiahua:sakura:palette', saved]]);
  const root = { dataset: {}, style: { setProperty(key, value) { tokens[key] = value; } } };
  const context = {
    window: {}, document: { documentElement: root, querySelector() { return { setAttribute() {} }; } },
    localStorage: {
      getItem(key) { if (blocked) throw Error('denied'); return storage.get(key); },
      setItem(key, value) { if (blocked) throw Error('denied'); storage.set(key, value); }
    }
  };
  vm.runInNewContext(source, context);
  return { api: context.window.SakuraThemes, root, tokens, storage };
}
function luminance(hex) {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
const { api, root, tokens, storage } = mount();
assert.equal(api.current, 'night');
for (const [key, theme] of Object.entries(api.themes)) {
  assert.equal(api.apply(key), true);
  assert.equal(root.dataset.palette, key);
  assert.equal(tokens['--bg'], theme.colors.bg);
  assert.equal(root.style.colorScheme, theme.scheme);
  assert.equal(storage.get('xiahua:sakura:palette'), key);
  assert.equal(api.scene.effect, 'calm', 'changing color must not enable particles');
  assert.equal(api.scene.palette.length, 5);
  assert.ok([...api.scene.background, ...api.scene.palette.flat()].every(v => Number.isFinite(v) && v >= 0 && v <= 1));
  assert.ok(luminance(theme.palette[4]) > .8, 'QR paper stays light in all themes');
  for (const [foreground, background] of [['ink', 'bg'], ['muted', 'bg'], ['muted', 'surface'], ['ink', 'selected'], ['accent-ink', 'accent']]) {
    assert.ok(contrast(theme.colors[foreground], theme.colors[background]) >= 4.5, `${key}: ${foreground}/${background} contrast`);
  }
  assert.equal(mount(key).api.current, key, 'saved choice restores at bootstrap');
}
const previous = api.current;
assert.equal(api.apply('__proto__'), false);
assert.equal(api.current, previous);
assert.equal(mount('invalid').api.current, 'night');
const privateTab = mount('moon', true);
assert.equal(privateTab.api.current, 'night');
assert.equal(privateTab.api.apply('moon'), true);
assert.equal(privateTab.api.current, 'moon');
console.log('PASS three palettes, valid GPU colors, UI contrast, light QR paper, calm effects, persistence, invalid keys, blocked storage.');

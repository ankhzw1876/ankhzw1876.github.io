import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const bundle = await readFile(new URL('vendor/sakura-engine.js', import.meta.url), 'utf8');
const shader = await readFile(new URL('engine-src/upstream/packages/renderer-webgpu/src/world-shaders.ts', import.meta.url), 'utf8');
assert.match(shader, /1\.0 - smoothstep\(0\.22, 0\.58, uniforms\.progress\)/);
assert.match(shader, /if \(opacity < 0\.02 \|\| geometry\.valid < 0\.5\)/);
assert.match(shader, /if \(input\.opacity < 0\.02\) \{ discard; \}/);
assert.ok(bundle.includes('every-qrcode-world-prop-pipeline'), 'rebuild the browser bundle after editing world shaders');

const context = {
  console: { ...console, error() {} },
  URL, URLSearchParams, TextEncoder, TextDecoder, crypto: webcrypto, performance,
  navigator: {}, requestAnimationFrame() { return 1; }, cancelAnimationFrame() {},
};
vm.createContext(context);
vm.runInContext(bundle, context, { filename: 'sakura-engine.js' });
const engine = context.SakuraEngine;
const worlds = Array.from(engine.SEED_WORLDS);
assert.deepEqual(worlds, ['sakura', 'islands', 'moon', 'library']);
assert.equal(engine.SAKURA_ENGINE_REVISION, 'micro-worlds-study-2');
for (const key of worlds) assert.equal(engine.isSeedWorld(key), true);
assert.equal(engine.isSeedWorld('city'), false);

const hash = array => createHash('sha256')
  .update(new Uint8Array(array.buffer, array.byteOffset, array.byteLength)).digest('hex');

async function inspect(url) {
  const identity = await engine.createEveryQRCodeIdentity(url, { identityScope: 'url' });
  const model = await engine.createSeedModel(identity, { generatorVersion: 1 });
  const fieldBefore = engine.createSeedBlockField(model, 'tree');
  const fingerprints = {};
  const counts = {};
  for (const world of worlds) {
    const first = engine.createSeedWorldScene(model, world);
    const repeated = engine.createSeedWorldScene(model, world);
    assert.equal(first.world, world);
    assert.equal(first.props.length, first.propCount * engine.WORLD_PROP_STRIDE);
    assert.ok(first.propCount <= engine.WORLD_PROP_LIMIT);
    assert.ok(Array.from(first.props).every(Number.isFinite));
    assert.equal(hash(first.props), hash(repeated.props), `${world} geometry must be deterministic`);
    fingerprints[world] = hash(first.props);
    counts[world] = first.propCount;
  }
  assert.equal(counts.sakura, 0);
  assert.ok(counts.islands >= 35 && counts.islands <= 90);
  assert.ok(counts.moon >= 40 && counts.moon <= 100);
  assert.ok(counts.library >= 60 && counts.library <= 140);
  const all = engine.createSeedWorldScenes(model);
  for (const world of worlds) assert.equal(hash(all[world].props), fingerprints[world]);
  assert.throws(() => engine.createSeedWorldScene(model, 'city'));
  const fieldAfter = engine.createSeedBlockField(model, 'tree');
  assert.equal(hash(fieldAfter.positions), hash(fieldBefore.positions), 'worlds never change QR block positions');
  assert.equal(hash(fieldAfter.types), hash(fieldBefore.types), 'worlds never change QR block types');
  return { counts, fingerprints };
}

const first = await inspect('https://ankhzw1876.github.io/');
const repeated = await inspect('https://ankhzw1876.github.io/');
const different = await inspect('https://example.com/另一个世界?emoji=🌕');
for (const world of ['islands', 'moon', 'library']) {
  assert.equal(first.fingerprints[world], repeated.fingerprints[world]);
  assert.notEqual(first.fingerprints[world], different.fingerprints[world], `${world} should react to URL identity`);
}

const noGpuCanvas = { dataset: {} };
const renderer = engine.mountSeed(noGpuCanvas, {}, {}, 'tree', { paused: true, world: 'moon' });
assert.equal(typeof renderer.setWorld, 'function');
renderer.setWorld('library');
assert.throws(() => renderer.setWorld('city'));
renderer.dispose();

console.log('PASS four deterministic world scenes, finite bounded prop buffers, URL variation, immutable QR block field, fade/discard speck guards, renderer world API and invalid-world rejection.');
console.log(JSON.stringify(first.counts));

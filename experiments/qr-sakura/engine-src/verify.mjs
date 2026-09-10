import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash, webcrypto } from "node:crypto";
import vm from "node:vm";

const source = await readFile(new URL("../vendor/sakura-engine.js", import.meta.url), "utf8");
// Guard the speck fix in both editable WGSL and the checked-in browser bundle.
const shaders = await readFile(new URL("upstream/packages/renderer-webgpu/src/tree-shaders.ts", import.meta.url), "utf8");
const flowerShader = shaders.split("export const TREE_FLOWER_SHADER")[1].split("export const TREE_FALLING_PETAL_SHADER")[0];
assert.match(flowerShader, /blossomScale = max\(0\.55, visibility\)/);
assert.match(flowerShader, /smoothstep\(0\.35, 0\.72, uniforms\.progress\)/);
assert.match(flowerShader, /if \(blossomOpacity\(\) < 0\.01\)/);
assert.match(flowerShader, /if \(opacity < 0\.01\) \{ discard; \}/);
assert.match(flowerShader, /return vec4f\(color, opacity\)/);
assert.doesNotMatch(flowerShader, /spunOffset\.[xyz] \* visibility/);
assert.ok(source.includes("fn blossomOpacity()"), "rebuild browser bundle after editing the shader");
let scheduled = 0;
const context = {
  console: { ...console, error() {} },
  URL, URLSearchParams, TextEncoder, TextDecoder, crypto: webcrypto, performance,
  navigator: {},
  requestAnimationFrame() { scheduled++; return scheduled; },
  cancelAnimationFrame() {},
};
vm.createContext(context);
vm.runInContext(source, context, { filename: "sakura-engine.js" });
const engine = context.SakuraEngine;
const hash = array => createHash("sha256").update(new Uint8Array(array.buffer, array.byteOffset, array.byteLength)).digest("hex");
async function generate(url) {
  const identity = await engine.createEveryQRCodeIdentity(url, { identityScope: "url" });
  const seed = await engine.createSeedModel(identity, { generatorVersion: 1 });
  const scene = engine.createSeedGpuScene(seed);
  assert.equal(seed.archetype, "cloud");
  assert.ok(scene.segmentCount > 50 && scene.segmentCount < 160);
  assert.ok(scene.flowerCount > 1000 && scene.flowerCount < 12000);
  assert.ok([...scene.segments, ...scene.flowers, ...scene.grass].every(Number.isFinite));
  const qr = engine.createQRSvgPath(identity.qr);
  assert.equal(qr.size, identity.qr.size + 8);
  assert.ok(qr.path.length > 100);
  return { identity, seed, scene, fingerprint: hash(scene.segments) + hash(scene.flowers) };
}

const first = await generate("https://baidddu.com");
const second = await generate("https://ankhzw1876.github.io");
const repeated = await generate("https://baidddu.com");
assert.equal(first.fingerprint, repeated.fingerprint, "same URL must reproduce the same geometry");
assert.notEqual(first.fingerprint, second.fingerprint, "different URLs must change branches");
await assert.rejects(engine.createSeedModel(first.identity, { generatorVersion: 2 }));
await assert.rejects(engine.createEveryQRCodeIdentity("javascript:alert(1)"));

// No-WebGPU case returns usable lifecycle controls and signals an explicit fallback.
const canvas = { dataset: {} };
let reportedError;
const renderer = engine.mountSeed(canvas, first.seed, {}, "tree", {
  paused: true,
  onError(error) { reportedError = error; },
});
renderer.setFlat(true, { immediate: true });
assert.equal(canvas.dataset.morphProgress, "1.000");
renderer.setReducedMotion(true);
renderer.setFlat(false);
assert.equal(canvas.dataset.morphProgress, "0.000");
renderer.pause();
renderer.resume();
await new Promise(resolve => setImmediate(resolve));
assert.equal(canvas.dataset.renderer, "webgpu-error");
assert.match(reportedError.message, /WebGPU/);
assert.equal(scheduled, 0, "unavailable GPU must not schedule a draw loop");
renderer.dispose();
console.log("PASS blossom speck regression guards, deterministic URL geometry, finite buffers, QR fallback geometry, version/security rejection, lifecycle without WebGPU.");
console.log(JSON.stringify({ first: { branches: first.scene.segmentCount, blossoms: first.scene.flowerCount }, second: { branches: second.scene.segmentCount, blossoms: second.scene.flowerCount } }));

# QR miniature worlds study engine

This is a local visual adaptation, not a claim that the reference video used this repository.

Upstream: https://github.com/AlbertAZ1992/every-qrcode

Pinned commit: `ed404c6cba9d48c04d5e08de780293cff1b242de` (2026-09-01), npm version 0.1.2. Upstream MIT copyright and permission are retained in `upstream/LICENSE` and `../vendor/THIRD_PARTY_LICENSES.txt`.

## Rebuild once, serve without a build system

Node 22 or later. Install only the pinned build dependencies in an isolated temporary directory, then invoke the checked-in build script:

```sh
SAKURA_BUILD_DEPS=$(mktemp -d /private/tmp/sakura-engine-build.XXXXXX)
export SAKURA_BUILD_DEPS
cp build-package.json "$SAKURA_BUILD_DEPS/package.json"
cp build-package-lock.json "$SAKURA_BUILD_DEPS/package-lock.json"
npm ci --prefix "$SAKURA_BUILD_DEPS" --ignore-scripts --no-audit --no-fund
node build.mjs
```

Run those commands from `engine-src`. The output `../vendor/sakura-engine.js` is a self-contained IIFE, including the QR encoder and URL parser; no CDN, network request, dynamic import, model asset, or framework is required at page runtime. Keep the output checked in for GitHub Pages. The lockfile pins the build and transitive dependencies. The native esbuild optional binary is included in npm's platform-specific package, so lifecycle scripts are not needed.

## API

Load the local script and use `window.SakuraEngine`:

```js
const identity = await SakuraEngine.createEveryQRCodeIdentity(url, { identityScope: "url" });
const seed = await SakuraEngine.createSeedModel(identity, { generatorVersion: 1 });
const renderer = SakuraEngine.mountSeed(canvas, seed, {
  effect: "calm",
  background: [0.965, 0.945, 0.906]
}, "tree", { onError, onReady, reducedMotion: false, paused: false });
renderer.setWorld("islands"); // sakura | islands | moon | library
renderer.setFlat(true); // about 950 ms
renderer.setFlat(false, { immediate: true });
renderer.pause(); // cancels RAF and GPU draw submissions; safe before GPU readiness
renderer.resume();
renderer.setReducedMotion(true); // freezes ambient time and stops continuous RAF
renderer.resize();
renderer.setZoom(1.12); // clamped to 0.82–1.45
renderer.setOrbit(Math.PI, -0.3); // tree orbit in radians; QR stays top-down
renderer.dispose();
```

`reducedMotion: true` freezes ambient movement and makes all `setFlat` transitions immediate. `setReducedMotion(boolean)` changes that policy after mounting and stops continuous RAF while reduced. `pause()` leaves the existing canvas image visible without continuing GPU draw submissions. `resume()` preserves transition and ambient time across the pause. An explicit `setFlat(flat, { immediate: true })` redraws exactly one frame even while paused; ordinary animated changes wait for resume. The wrapper should pause on `visibilitychange`, intersection-hidden, and when the host iframe is hidden. Reduced-motion resize, scene and zoom updates redraw only when not paused.

Exported fallback helper `createQRSvgPath(identity.qr)` returns `{ size, path }`; set a square SVG viewBox and draw the path in black on white. The canonical matrix and fallback remain upstream's tested QR encoder. Interactive 3D needs HTTPS or localhost and a usable WebGPU adapter. Lower-level `mountSeed` reports initialization errors to `onError`; it does not insert fallback UI itself.

## Local artistic changes

`setOrbit(yaw, pitch)` uses radians relative to the default tree camera. Yaw wraps continuously through 360°; pitch offsets clamp to -0.9–0.35 radians to keep the view above the ground. Non-finite inputs normalize to zero. Camera state survives GPU initialization, pause/resume and palette changes; reduced-motion input redraws one frame without starting an animation loop. `projectPosition` blends the orbit back to the canonical QR camera and frames near-overhead inspection to keep the slab visible. The wrapper blocks rotation during morphing and in QR mode, and resets camera state on URL regeneration. This addition is for the tree renderer, not the unused terrain form.

- One thick, curved, tapering brown trunk with five tiers of spreading boughs, forks and upward twig ends. URL DNA determines height, lean, branch angles, lengths, cluster placement and density.
- Only flattened clusters at actual twig tips; the full spherical `addCanopySurface()` overlay is not used. No random conifer/banana/multiple-trunk substitution.
- Pink five-petal flowers with yellow centers; bright green thin meadow blades and small raised pink flowers at QR-dependent perimeter cells.
- Cream/sand checker platform, brown bark independent of green grass palette, full square QR modules instead of rounded QR cells.
- Renderer lifecycle additions `pause`, `resume`, immediate transitions and reduced-motion support.
- Screenshot-driven refinement: reduced overlapping blossom density, enlarged rounded petals, wider grass blades, faceted curved trunk without horizontal ring bands, and four discrete cream/khaki/sand/sage tile tones. Flower and grass colors bypass the upstream ACES/gamma/high-saturation chain to avoid blown-out pink and fluorescent green.
- Flowers use raised cup-shaped petals with pale pink bodies and darker pink tips. QR ink is independent: interior fallen-petal modules remain stronger pink, perimeter grass modules remain green. WebGPU device loss is forwarded to `onError` so the wrapper can switch to its static fallback.
- The legacy elevated voxel scaffold is clipped throughout the morph. It previously appeared as white cubes/specks between tree and QR; the independent branches, blossoms, grass and complete base QR layer are retained.
- Blossoms now fade out before the final QR reveal instead of shrinking twice into opaque subpixel specks. Petal size is bounded during the fade, near-transparent geometry is clipped, and reverse transitions use the same progress-based opacity. Tree and QR endpoints are unchanged.
- Live color studies use `setScene` without remounting geometry. Grass, ceramic tiles, petal tips and QR ink follow the five-color palette; bark and yellow flower centers retain their natural material colors. The existing shadow pass also draws a light four-module QR margin below the matrix late in the morph, with framing adjusted to keep the full margin visible. No particle effects are enabled.
- `world-scene.ts` deterministically generates three additional prop scenes from the same URL seed: floating islands, a moon base and a miniature library. One generic instanced WebGPU pipeline draws their box, frustum, cylinder, sphere, pyramid and ribbon primitives. `setWorld()` swaps one bounded storage buffer without rebuilding the QR identity, GPU device, palette or camera.
- World props fade and are clipped before QR modules and their paper margin become visible; they never shrink into opaque subpixel points. The canonical QR block field, four-module quiet zone and final QR material are independent of the selected world.

Run `node verify.mjs`, `node ../verify-worlds.mjs`, `node ../verify-orbit.mjs`, and `node ../verify-themes.mjs` after rebuilding. GPU shader compilation, composition and screenshot decoding are verified in the containing browser page.

`generatorVersion: 1` pins upstream QR/DNA behavior. The altered visual recipe has its own revision `micro-worlds-study-2`; it is intentionally not visually identical to unmodified upstream generator v1. No browser or screenshot claim is made by the build script; visual QA belongs to the containing page.

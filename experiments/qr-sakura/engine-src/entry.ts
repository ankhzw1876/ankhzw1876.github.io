/** Browser-only public surface for the locally adapted Sakura study. */
export {
  createEveryQRCodeIdentity,
  createQRSvgPath,
  createQRMatrix,
  CURRENT_GENERATOR_VERSION,
} from "./upstream/packages/core/src/index.js";
export { createSeedGpuScene } from "./upstream/packages/renderer-webgpu/src/gpu-scene.js";
export { createSeedBlockField } from "./upstream/packages/renderer-webgpu/src/seed-model.js";
export {
  mountSeed,
  MORPH_DURATION_MS,
  normalizeSeedOrbit,
  isSeedWorld,
} from "./upstream/packages/renderer-webgpu/src/renderer.js";
export {
  createSeedWorldScene,
  createSeedWorldScenes,
  SEED_WORLDS,
  WORLD_CODES,
  WORLD_PROP_LIMIT,
  WORLD_PROP_STRIDE,
  WORLD_PROP_VERTEX_COUNT,
} from "./upstream/packages/renderer-webgpu/src/world-scene.js";
import {
  createSeedModel as createUpstreamSeedModel,
  type CreateSeedModelOptions,
} from "./upstream/packages/renderer-webgpu/src/seed-model.js";
import type { EveryQRCodeIdentity } from "./upstream/packages/core/src/index.js";

export const SAKURA_ENGINE_REVISION = "micro-worlds-study-2";
export const UPSTREAM_COMMIT = "ed404c6cba9d48c04d5e08de780293cff1b242de";

/** QR/DNA use upstream generator v1; world geometry is a local deterministic layer. */
export async function createSeedModel(identity: EveryQRCodeIdentity, options: CreateSeedModelOptions = {}) {
  if (options.generatorVersion !== undefined && options.generatorVersion !== 1) {
    throw new Error("The Sakura study supports generatorVersion 1 only.");
  }
  const model = await createUpstreamSeedModel(identity, { generatorVersion: 1 });
  return { ...model, archetype: "cloud" as const };
}

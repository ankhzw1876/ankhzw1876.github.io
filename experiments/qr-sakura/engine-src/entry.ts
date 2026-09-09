/** Browser-only public surface for the locally adapted Sakura study. */
export {
  createEveryQRCodeIdentity,
  createQRSvgPath,
  createQRMatrix,
  CURRENT_GENERATOR_VERSION,
} from "./upstream/packages/core/src/index.js";
export { createSeedGpuScene } from "./upstream/packages/renderer-webgpu/src/gpu-scene.js";
export { createSeedBlockField } from "./upstream/packages/renderer-webgpu/src/seed-model.js";
export { mountSeed, MORPH_DURATION_MS } from "./upstream/packages/renderer-webgpu/src/renderer.js";
import {
  createSeedModel as createUpstreamSeedModel,
  type CreateSeedModelOptions,
} from "./upstream/packages/renderer-webgpu/src/seed-model.js";
import type { EveryQRCodeIdentity } from "./upstream/packages/core/src/index.js";

export const SAKURA_ENGINE_REVISION = "sakura-study-1";
export const UPSTREAM_COMMIT = "ed404c6cba9d48c04d5e08de780293cff1b242de";

/** QR/DNA use upstream generator v1; the local artistic recipe is Sakura study 1. */
export async function createSeedModel(identity: EveryQRCodeIdentity, options: CreateSeedModelOptions = {}) {
  if (options.generatorVersion !== undefined && options.generatorVersion !== 1) {
    throw new Error("The Sakura study supports generatorVersion 1 only.");
  }
  const model = await createUpstreamSeedModel(identity, { generatorVersion: 1 });
  return { ...model, archetype: "cloud" as const };
}

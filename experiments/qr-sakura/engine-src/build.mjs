/** One-time build. No package runtime/CDN calls are made by the website. */
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";

const here = dirname(fileURLToPath(import.meta.url));
const dependencyRoot = process.env.SAKURA_BUILD_DEPS;
if (!dependencyRoot) throw new Error("Set SAKURA_BUILD_DEPS to the isolated directory containing the pinned build dependencies.");
const requireFromDeps = createRequire(resolve(dependencyRoot, "package.json"));
const { build } = requireFromDeps("esbuild");
const output = resolve(here, "../vendor/sakura-engine.js");
await mkdir(dirname(output), { recursive: true });
const result = await build({
  entryPoints: [resolve(here, "entry.ts")],
  outfile: output,
  bundle: true,
  format: "iife",
  globalName: "SakuraEngine",
  platform: "browser",
  target: ["es2022"],
  minify: true,
  sourcemap: false,
  metafile: true,
  legalComments: "inline",
  nodePaths: [resolve(dependencyRoot, "node_modules")],
  alias: { "@every-qrcode/core": resolve(here, "upstream/packages/core/src/index.ts") },
  banner: { js: "/*! QR miniature worlds study 2; adapted from Every QR Code 0.1.2, MIT, commit ed404c6cba9d48c04d5e08de780293cff1b242de. See THIRD_PARTY_LICENSES.txt and ../engine-src/README.md. */" },
});
const bundledDependencies = [...new Set(Object.keys(result.metafile.inputs)
  .filter(path => path.includes("node_modules/"))
  .map(path => path.split("node_modules/").pop().split("/")[0]))].sort();
await writeFile(resolve(here, "../vendor/build-info.json"), JSON.stringify({
  revision: "micro-worlds-study-2",
  upstreamCommit: "ed404c6cba9d48c04d5e08de780293cff1b242de",
  generatorVersion: 1,
  format: "iife",
  global: "SakuraEngine",
  buildTool: "esbuild@0.25.9",
  bundledDependencies,
}, null, 2) + "\n");
console.log(`Built ${output}`);
console.log(`Bundled dependencies: ${bundledDependencies.join(", ")}`);

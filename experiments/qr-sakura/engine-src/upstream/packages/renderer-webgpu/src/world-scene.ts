import { SEED_BLOCK_SIZE, type SeedModel } from "./seed-model.js";

export const SEED_WORLDS = ["sakura", "islands", "moon", "library"] as const;

export type SeedWorld = (typeof SEED_WORLDS)[number];

export const WORLD_CODES: Readonly<Record<SeedWorld, number>> = {
  islands: 1,
  library: 3,
  moon: 2,
  sakura: 0,
};

export const WORLD_PRIMITIVES = {
  box: 0,
  frustum: 1,
  cylinder: 2,
  sphere: 3,
  pyramid: 4,
  ribbon: 5,
} as const;

export const WORLD_MATERIALS = {
  rock: 0,
  foliage: 1,
  structure: 2,
  accent: 3,
  metal: 4,
  glass: 5,
  dark: 6,
  water: 7,
  wood: 8,
  paper: 9,
  glow: 10,
  lunar: 11,
} as const;

/** Three vec4 values: center/type, size/material, Euler rotation/seed. */
export const WORLD_PROP_STRIDE = 12;
export const WORLD_PROP_VERTEX_COUNT = 216;
export const WORLD_PROP_LIMIT = 160;

export type SeedWorldPropScene = {
  readonly propCount: number;
  readonly props: Float32Array;
  readonly world: SeedWorld;
};

type Vec3 = readonly [number, number, number];

type PropSpec = {
  readonly center: Vec3;
  readonly material: number;
  readonly primitive: number;
  readonly rotation?: Vec3;
  readonly seed?: number;
  readonly size: Vec3;
};

type SceneBuilder = {
  readonly activeModules: ReadonlySet<number>;
  readonly model: SeedModel;
  readonly props: number[];
  readonly side: number;
  readonly top: number;
};

const TAU = Math.PI * 2;

function fract(value: number): number {
  return value - Math.floor(value);
}

function random(model: SeedModel, first: number, second = 0, salt = 0): number {
  const source = Number.isFinite(model.morphSeed) ? model.morphSeed : 0;
  const angle = source * 7_919 + first * 127.1 + second * 311.7 + salt * 43.7;
  return fract(Math.sin(angle) * 43_758.5453);
}

function localDensity(builder: SceneBuilder, normalizedX: number, normalizedZ: number, radius = 0.2): number {
  const { activeModules, model } = builder;
  if (model.modules.length === 0 || model.qrSize <= 0) return 0;
  const center = (model.qrSize - 1) * 0.5;
  const sampleX = center + normalizedX * model.qrSize;
  const sampleZ = center + normalizedZ * model.qrSize;
  const radiusCells = Math.max(1, radius * model.qrSize);
  let active = 0;
  let possible = 0;
  for (let row = Math.max(0, Math.floor(sampleZ - radiusCells)); row <= Math.min(model.qrSize - 1, Math.ceil(sampleZ + radiusCells)); row++) {
    for (let column = Math.max(0, Math.floor(sampleX - radiusCells)); column <= Math.min(model.qrSize - 1, Math.ceil(sampleX + radiusCells)); column++) {
      if ((column - sampleX) ** 2 + (row - sampleZ) ** 2 > radiusCells ** 2) continue;
      possible++;
      const index = row * model.qrSize + column;
      if (activeModules.has(index)) active++;
    }
  }
  return possible === 0 ? 0 : active / possible;
}

function pushProp(builder: SceneBuilder, spec: PropSpec): void {
  if (builder.props.length / WORLD_PROP_STRIDE >= WORLD_PROP_LIMIT) {
    throw new RangeError(`World prop limit exceeded (${WORLD_PROP_LIMIT})`);
  }
  const rotation = spec.rotation ?? [0, 0, 0];
  const values = [
    spec.center[0], spec.center[1], spec.center[2], spec.primitive,
    Math.max(0.0001, Math.abs(spec.size[0])),
    Math.max(0.0001, Math.abs(spec.size[1])),
    Math.max(0.0001, Math.abs(spec.size[2])),
    spec.material,
    rotation[0], rotation[1], rotation[2], fract(spec.seed ?? 0),
  ];
  if (!values.every(Number.isFinite)) throw new TypeError("World props must contain finite numbers");
  builder.props.push(...values);
}

function rotateXZ(x: number, z: number, yaw: number): readonly [number, number] {
  const cosine = Math.cos(yaw);
  const sine = Math.sin(yaw);
  return [x * cosine - z * sine, x * sine + z * cosine];
}

function addBox(
  builder: SceneBuilder,
  center: Vec3,
  size: Vec3,
  material: number,
  seed: number,
  rotation: Vec3 = [0, 0, 0],
): void {
  pushProp(builder, { center, material, primitive: WORLD_PRIMITIVES.box, rotation, seed, size });
}

function addCylinder(
  builder: SceneBuilder,
  center: Vec3,
  size: Vec3,
  material: number,
  seed: number,
  rotation: Vec3 = [0, 0, 0],
): void {
  pushProp(builder, { center, material, primitive: WORLD_PRIMITIVES.cylinder, rotation, seed, size });
}

function addSphere(
  builder: SceneBuilder,
  center: Vec3,
  size: Vec3,
  material: number,
  seed: number,
): void {
  pushProp(builder, { center, material, primitive: WORLD_PRIMITIVES.sphere, seed, size });
}

function addFloatingIslands(builder: SceneBuilder): void {
  const { model, side, top } = builder;
  const sites = [
    [-0.19, -0.05, 0.25],
    [0.17, -0.17, 0.18],
    [0.2, 0.18, 0.14],
    [-0.2, 0.2, 0.12],
    [0.015, 0.16, 0.2],
  ] as const;
  const islandCenters: Array<readonly [number, number, number]> = [];

  sites.forEach(([nx, nz, lift], index) => {
    const density = localDensity(builder, nx, nz, 0.18);
    const jitterX = (random(model, index, 0, 101) - 0.5) * side * 0.035;
    const jitterZ = (random(model, index, 0, 102) - 0.5) * side * 0.035;
    const x = nx * side + jitterX;
    const z = nz * side + jitterZ;
    const radius = side * (0.105 + density * 0.035 + random(model, index, 0, 103) * 0.018);
    const height = side * (0.14 + lift * 0.28 + random(model, index, 0, 104) * 0.035);
    const islandTop = top + side * (lift + density * 0.035);
    islandCenters.push([x, islandTop, z]);

    pushProp(builder, {
      center: [x, islandTop - height * 0.5, z],
      material: WORLD_MATERIALS.rock,
      primitive: WORLD_PRIMITIVES.frustum,
      rotation: [random(model, index, 0, 105) * TAU, 0, 0],
      seed: random(model, index, 0, 106),
      size: [radius * 2, height, radius * (1.65 + random(model, index, 0, 107) * 0.3)],
    });
    addCylinder(
      builder,
      [x, islandTop + side * 0.008, z],
      [radius * 1.86, side * 0.025, radius * 1.54],
      WORLD_MATERIALS.foliage,
      random(model, index, 0, 108),
    );

    const outcropAngle = random(model, index, 0, 109) * TAU;
    const outcropRadius = radius * 0.52;
    pushProp(builder, {
      center: [
        x + Math.cos(outcropAngle) * radius * 0.54,
        islandTop - height * 0.42,
        z + Math.sin(outcropAngle) * radius * 0.5,
      ],
      material: WORLD_MATERIALS.rock,
      primitive: WORLD_PRIMITIVES.frustum,
      rotation: [outcropAngle, 0, 0],
      seed: random(model, index, 0, 110),
      size: [outcropRadius * 1.2, height * 0.62, outcropRadius],
    });

    if (index !== 2) {
      const treeX = x + (random(model, index, 0, 111) - 0.5) * radius * 0.65;
      const treeZ = z + (random(model, index, 0, 112) - 0.5) * radius * 0.55;
      addCylinder(
        builder,
        [treeX, islandTop + side * 0.055, treeZ],
        [side * 0.018, side * 0.11, side * 0.018],
        WORLD_MATERIALS.wood,
        random(model, index, 0, 113),
      );
      addSphere(
        builder,
        [treeX, islandTop + side * 0.125, treeZ],
        [side * 0.09, side * 0.105, side * 0.09],
        index % 2 === 0 ? WORLD_MATERIALS.accent : WORLD_MATERIALS.foliage,
        random(model, index, 0, 114),
      );
    }
  });

  const main = islandCenters[0]!;
  addBox(
    builder,
    [main[0] - side * 0.01, main[1] + side * 0.055, main[2]],
    [side * 0.085, side * 0.09, side * 0.07],
    WORLD_MATERIALS.structure,
    random(model, 1, 0, 140),
    [0.28, 0, 0],
  );
  pushProp(builder, {
    center: [main[0] - side * 0.01, main[1] + side * 0.12, main[2]],
    material: WORLD_MATERIALS.accent,
    primitive: WORLD_PRIMITIVES.pyramid,
    rotation: [0.28, 0, 0],
    seed: random(model, 2, 0, 141),
    size: [side * 0.11, side * 0.075, side * 0.095],
  });

  const waterfallIsland = islandCenters[1]!;
  const waterHeight = waterfallIsland[1] - top + side * 0.08;
  pushProp(builder, {
    center: [waterfallIsland[0] + side * 0.055, waterfallIsland[1] - waterHeight * 0.5, waterfallIsland[2] + side * 0.01],
    material: WORLD_MATERIALS.water,
    primitive: WORLD_PRIMITIVES.ribbon,
    rotation: [0.35, 0, 0],
    seed: random(model, 3, 0, 142),
    size: [side * 0.035, waterHeight, side * 0.004],
  });

  const bridgeStart = islandCenters[0]!;
  const bridgeEnd = islandCenters[4]!;
  for (let step = 1; step <= 7; step++) {
    const progress = step / 8;
    const x = bridgeStart[0] + (bridgeEnd[0] - bridgeStart[0]) * progress;
    const y = bridgeStart[1] + (bridgeEnd[1] - bridgeStart[1]) * progress + Math.sin(progress * Math.PI) * side * 0.025;
    const z = bridgeStart[2] + (bridgeEnd[2] - bridgeStart[2]) * progress;
    const yaw = Math.atan2(bridgeEnd[0] - bridgeStart[0], bridgeEnd[2] - bridgeStart[2]);
    addBox(
      builder,
      [x, y + side * 0.014, z],
      [side * 0.04, side * 0.012, side * 0.022],
      WORLD_MATERIALS.wood,
      random(model, step, 0, 145),
      [yaw, 0, 0],
    );
  }

  for (let index = 0; index < 11; index++) {
    const angle = random(model, index, 0, 160) * TAU;
    const distance = side * (0.16 + random(model, index, 0, 161) * 0.34);
    addSphere(
      builder,
      [
        Math.cos(angle) * distance,
        top + side * (0.01 + random(model, index, 0, 162) * 0.055),
        Math.sin(angle) * distance,
      ],
      [side * (0.08 + random(model, index, 0, 163) * 0.07), side * 0.035, side * 0.065],
      WORLD_MATERIALS.paper,
      random(model, index, 0, 164),
    );
  }
}

function addMoonBase(builder: SceneBuilder): void {
  const { model, side, top } = builder;
  const habitats = [
    [-0.12, -0.04, 0.085],
    [0.11, 0.03, 0.065],
    [0.02, 0.17, 0.05],
  ] as const;

  habitats.forEach(([nx, nz, radiusN], index) => {
    const radius = side * (radiusN + localDensity(builder, nx, nz, 0.16) * 0.015);
    const x = nx * side;
    const z = nz * side;
    addSphere(
      builder,
      [x, top + radius * 0.23, z],
      [radius * 2, radius * 1.25, radius * 2],
      index === 0 ? WORLD_MATERIALS.structure : WORLD_MATERIALS.glass,
      random(model, index, 0, 300),
    );
    addCylinder(
      builder,
      [x, top + side * 0.012, z],
      [radius * 2.18, side * 0.025, radius * 2.18],
      WORLD_MATERIALS.metal,
      random(model, index, 0, 301),
    );
  });

  for (let index = 0; index < habitats.length - 1; index++) {
    const start = habitats[index]!;
    const end = habitats[index + 1]!;
    const x0 = start[0] * side;
    const z0 = start[1] * side;
    const x1 = end[0] * side;
    const z1 = end[1] * side;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const length = Math.hypot(dx, dz);
    const yaw = -Math.atan2(dx, dz);
    addCylinder(
      builder,
      [(x0 + x1) * 0.5, top + side * 0.045, (z0 + z1) * 0.5],
      [side * 0.032, length, side * 0.032],
      WORLD_MATERIALS.structure,
      random(model, index, 0, 305),
      [yaw, Math.PI * 0.5, 0],
    );
  }

  const panelSites = [
    [-0.24, -0.18, 0.15],
    [0.2, -0.16, -0.12],
    [-0.23, 0.18, 0.24],
    [0.23, 0.2, -0.22],
  ] as const;
  panelSites.forEach(([nx, nz, yaw], group) => {
    const x = nx * side;
    const z = nz * side;
    addCylinder(
      builder,
      [x, top + side * 0.035, z],
      [side * 0.013, side * 0.07, side * 0.013],
      WORLD_MATERIALS.metal,
      random(model, group, 0, 310),
    );
    for (let panel = -1; panel <= 1; panel++) {
      const [offsetX, offsetZ] = rotateXZ(panel * side * 0.065, 0, yaw);
      addBox(
        builder,
        [x + offsetX, top + side * 0.075, z + offsetZ],
        [side * 0.058, side * 0.009, side * 0.105],
        WORLD_MATERIALS.dark,
        random(model, group, panel, 311),
        [yaw, -0.18, 0],
      );
    }
  });

  addCylinder(
    builder,
    [side * 0.015, top + side * 0.13, -side * 0.18],
    [side * 0.018, side * 0.24, side * 0.018],
    WORLD_MATERIALS.metal,
    random(model, 0, 0, 320),
  );
  addSphere(
    builder,
    [side * 0.015, top + side * 0.265, -side * 0.18],
    [side * 0.07, side * 0.025, side * 0.07],
    WORLD_MATERIALS.glow,
    random(model, 1, 0, 321),
  );

  for (let crater = 0; crater < 2; crater++) {
    const cx = side * (crater === 0 ? -0.29 : 0.29);
    const cz = side * (crater === 0 ? 0.07 : -0.02);
    const radius = side * (crater === 0 ? 0.075 : 0.055);
    for (let segment = 0; segment < 10; segment++) {
      const angle = segment / 10 * TAU;
      pushProp(builder, {
        center: [cx + Math.cos(angle) * radius, top + side * 0.012, cz + Math.sin(angle) * radius],
        material: WORLD_MATERIALS.lunar,
        primitive: WORLD_PRIMITIVES.frustum,
        rotation: [angle, 0, 0],
        seed: random(model, crater, segment, 330),
        size: [side * 0.026, side * 0.025, side * 0.04],
      });
    }
  }

  const roverX = side * 0.15;
  const roverZ = side * -0.27;
  addBox(builder, [roverX, top + side * 0.035, roverZ], [side * 0.095, side * 0.045, side * 0.065], WORLD_MATERIALS.accent, random(model, 0, 0, 340), [0.3, 0, 0]);
  for (const [dx, dz] of [[-0.045, -0.035], [0.045, -0.035], [-0.045, 0.035], [0.045, 0.035]] as const) {
    const [offsetX, offsetZ] = rotateXZ(dx * side, dz * side, 0.3);
    addCylinder(
      builder,
      [roverX + offsetX, top + side * 0.018, roverZ + offsetZ],
      [side * 0.022, side * 0.018, side * 0.022],
      WORLD_MATERIALS.dark,
      random(model, dx, dz, 341),
      [0.3, 0, Math.PI * 0.5],
    );
  }
}

function addShelf(
  builder: SceneBuilder,
  centerX: number,
  centerZ: number,
  yaw: number,
  width: number,
  height: number,
  depth: number,
  shelfIndex: number,
): void {
  const { model, top } = builder;
  const transform = (localX: number, localZ: number): readonly [number, number] => {
    const [x, z] = rotateXZ(localX, localZ, yaw);
    return [centerX + x, centerZ + z];
  };
  const addShelfBox = (localX: number, localY: number, localZ: number, size: Vec3, salt: number): void => {
    const [x, z] = transform(localX, localZ);
    addBox(builder, [x, top + localY, z], size, WORLD_MATERIALS.wood, random(model, shelfIndex, salt, 500), [yaw, 0, 0]);
  };
  const post = width * 0.055;
  addShelfBox(-width * 0.47, height * 0.5, 0, [post, height, depth], 1);
  addShelfBox(width * 0.47, height * 0.5, 0, [post, height, depth], 2);
  for (let level = 0; level <= 3; level++) {
    addShelfBox(0, height * (0.04 + level * 0.3), 0, [width, height * 0.035, depth], 10 + level);
  }

  for (let level = 0; level < 3; level++) {
    const bookCount = 5;
    for (let book = 0; book < bookCount; book++) {
      const bookWidth = width * (0.105 + random(model, shelfIndex, book + level * 10, 510) * 0.035);
      const bookHeight = height * (0.17 + random(model, shelfIndex, book + level * 10, 511) * 0.065);
      const localX = -width * 0.35 + book * width * 0.17;
      const localY = height * (0.08 + level * 0.3) + bookHeight * 0.5;
      const [x, z] = transform(localX, -depth * 0.035);
      const material = [WORLD_MATERIALS.accent, WORLD_MATERIALS.structure, WORLD_MATERIALS.foliage, WORLD_MATERIALS.paper][(book + level + shelfIndex) % 4]!;
      addBox(
        builder,
        [x, top + localY, z],
        [bookWidth, bookHeight, depth * 0.58],
        material,
        random(model, shelfIndex, book + level * 10, 512),
        [yaw, 0, (random(model, shelfIndex, book + level * 10, 513) - 0.5) * 0.09],
      );
    }
  }
}

function addMiniLibrary(builder: SceneBuilder): void {
  const { model, side, top } = builder;
  const shelfWidth = side * 0.25;
  const shelfHeight = side * 0.34;
  const shelfDepth = side * 0.055;
  addShelf(builder, 0, side * 0.285, 0, shelfWidth * 1.25, shelfHeight, shelfDepth, 0);
  addShelf(builder, -side * 0.285, side * 0.04, Math.PI * 0.5, shelfWidth, shelfHeight * 0.94, shelfDepth, 1);
  addShelf(builder, side * 0.285, side * 0.04, -Math.PI * 0.5, shelfWidth, shelfHeight * 0.94, shelfDepth, 2);

  addCylinder(
    builder,
    [0, top + side * 0.105, -side * 0.045],
    [side * 0.23, side * 0.18, side * 0.18],
    WORLD_MATERIALS.wood,
    random(model, 0, 0, 600),
  );
  addBox(
    builder,
    [0, top + side * 0.205, -side * 0.045],
    [side * 0.25, side * 0.025, side * 0.19],
    WORLD_MATERIALS.wood,
    random(model, 1, 0, 601),
    [0.06, 0, 0],
  );

  for (let book = 0; book < 6; book++) {
    addBox(
      builder,
      [
        side * (-0.06 + book * 0.023),
        top + side * (0.226 + book * 0.009),
        -side * 0.05,
      ],
      [side * 0.1, side * 0.014, side * 0.065],
      book % 2 === 0 ? WORLD_MATERIALS.accent : WORLD_MATERIALS.structure,
      random(model, book, 0, 602),
      [0.18 - book * 0.025, 0, 0],
    );
  }

  addCylinder(
    builder,
    [-side * 0.075, top + side * 0.275, -side * 0.045],
    [side * 0.014, side * 0.115, side * 0.014],
    WORLD_MATERIALS.metal,
    random(model, 0, 0, 610),
  );
  addSphere(
    builder,
    [-side * 0.075, top + side * 0.345, -side * 0.045],
    [side * 0.065, side * 0.055, side * 0.065],
    WORLD_MATERIALS.glow,
    random(model, 1, 0, 611),
  );

  for (const [x, z, yaw] of [[-0.17, -0.22, 0.2], [0.18, -0.2, -0.25]] as const) {
    addBox(builder, [x * side, top + side * 0.08, z * side], [side * 0.105, side * 0.028, side * 0.09], WORLD_MATERIALS.structure, random(model, x, z, 620), [yaw, 0, 0]);
    addCylinder(builder, [x * side, top + side * 0.037, z * side], [side * 0.075, side * 0.07, side * 0.075], WORLD_MATERIALS.wood, random(model, x, z, 621));
  }
}

function buildWorld(model: SeedModel, world: SeedWorld): SeedWorldPropScene {
  if (world === "sakura") return { propCount: 0, props: new Float32Array(), world };
  const props: number[] = [];
  const side = Math.max(SEED_BLOCK_SIZE * 21, model.qrSize * SEED_BLOCK_SIZE);
  const builder: SceneBuilder = {
    activeModules: new Set(model.modules.map((module) => module.index)),
    model,
    props,
    side,
    top: SEED_BLOCK_SIZE,
  };
  if (world === "islands") addFloatingIslands(builder);
  else if (world === "moon") addMoonBase(builder);
  else addMiniLibrary(builder);
  const packed = new Float32Array(props);
  if (packed.length % WORLD_PROP_STRIDE !== 0 || !packed.every(Number.isFinite)) {
    throw new TypeError(`Invalid ${world} prop buffer`);
  }
  const propCount = packed.length / WORLD_PROP_STRIDE;
  if (propCount > WORLD_PROP_LIMIT) throw new RangeError(`World prop limit exceeded (${propCount})`);
  return { propCount, props: packed, world };
}

export function createSeedWorldScene(model: SeedModel, world: SeedWorld = "sakura"): SeedWorldPropScene {
  if (!SEED_WORLDS.includes(world)) throw new RangeError(`Unsupported seed world: ${world}`);
  return buildWorld(model, world);
}

export function createSeedWorldScenes(model: SeedModel): Readonly<Record<SeedWorld, SeedWorldPropScene>> {
  return {
    islands: buildWorld(model, "islands"),
    library: buildWorld(model, "library"),
    moon: buildWorld(model, "moon"),
    sakura: buildWorld(model, "sakura"),
  };
}

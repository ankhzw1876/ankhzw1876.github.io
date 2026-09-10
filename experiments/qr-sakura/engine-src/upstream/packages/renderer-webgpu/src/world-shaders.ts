import { SEED_UNIFORMS_WGSL } from "./shared-shaders.js";

export const WORLD_PROP_SHADER = /* wgsl */ `
${SEED_UNIFORMS_WGSL}

struct WorldProp {
  centerType: vec4f,
  sizeMaterial: vec4f,
  rotationSeed: vec4f,
}

struct PropGeometry {
  position: vec3f,
  normal: vec3f,
  valid: f32,
}

struct PropOutput {
  @builtin(position) position: vec4f,
  @location(0) normal: vec3f,
  @location(1) @interpolate(flat) material: u32,
  @location(2) seed: f32,
  @location(3) opacity: f32,
  @location(4) localHeight: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> props: array<WorldProp>;

fn quadVertex(index: u32) -> vec2f {
  let quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  return quad[index % 6u];
}

fn boxGeometry(index: u32) -> PropGeometry {
  if (index >= 36u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  let face = index / 6u;
  let uv = quadVertex(index) * 0.5;
  var position = vec3f(0.0);
  var normal = vec3f(0.0, 1.0, 0.0);
  if (face == 0u) { position = vec3f(uv.x, 0.5, uv.y); }
  else if (face == 1u) { position = vec3f(uv.x, -0.5, -uv.y); normal = vec3f(0.0, -1.0, 0.0); }
  else if (face == 2u) { position = vec3f(uv.x, uv.y, 0.5); normal = vec3f(0.0, 0.0, 1.0); }
  else if (face == 3u) { position = vec3f(-uv.x, uv.y, -0.5); normal = vec3f(0.0, 0.0, -1.0); }
  else if (face == 4u) { position = vec3f(0.5, uv.y, -uv.x); normal = vec3f(1.0, 0.0, 0.0); }
  else { position = vec3f(-0.5, uv.y, uv.x); normal = vec3f(-1.0, 0.0, 0.0); }
  return PropGeometry(position, normal, 1.0);
}

fn frustumGeometry(index: u32) -> PropGeometry {
  if (index >= 36u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  let face = index / 6u;
  let uv = quadVertex(index) * 0.5;
  let bottomScale = 0.34;
  var position = vec3f(0.0);
  var normal = vec3f(0.0, 1.0, 0.0);
  if (face == 0u) { position = vec3f(uv.x, 0.5, uv.y); }
  else if (face == 1u) { position = vec3f(uv.x * bottomScale, -0.5, -uv.y * bottomScale); normal = vec3f(0.0, -1.0, 0.0); }
  else {
    let heightT = uv.y + 0.5;
    let width = mix(bottomScale, 1.0, heightT);
    if (face == 2u) { position = vec3f(uv.x * width, uv.y, 0.5 * width); normal = normalize(vec3f(0.0, -0.33, 1.0)); }
    else if (face == 3u) { position = vec3f(-uv.x * width, uv.y, -0.5 * width); normal = normalize(vec3f(0.0, -0.33, -1.0)); }
    else if (face == 4u) { position = vec3f(0.5 * width, uv.y, -uv.x * width); normal = normalize(vec3f(1.0, -0.33, 0.0)); }
    else { position = vec3f(-0.5 * width, uv.y, uv.x * width); normal = normalize(vec3f(-1.0, -0.33, 0.0)); }
  }
  return PropGeometry(position, normal, 1.0);
}

fn cylinderGeometry(index: u32) -> PropGeometry {
  if (index >= 144u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  let sideVertices = 72u;
  let capVertices = 36u;
  if (index < sideVertices) {
    let segment = index / 6u;
    let vertex = index % 6u;
    let angleA = f32(segment) / 12.0 * 6.2831853;
    let angleB = f32(segment + 1u) / 12.0 * 6.2831853;
    let useB = vertex == 1u || vertex == 4u || vertex == 5u;
    let upper = vertex == 2u || vertex == 3u || vertex == 5u;
    let angle = select(angleA, angleB, useB);
    let y = select(-0.5, 0.5, upper);
    let radial = vec3f(cos(angle) * 0.5, 0.0, sin(angle) * 0.5);
    return PropGeometry(vec3f(radial.x, y, radial.z), normalize(radial), 1.0);
  }
  let top = index < sideVertices + capVertices;
  var capIndex = index - sideVertices;
  if (!top) { capIndex = index - sideVertices - capVertices; }
  let segment = capIndex / 3u;
  let vertex = capIndex % 3u;
  let angleA = f32(segment) / 12.0 * 6.2831853;
  let angleB = f32(segment + 1u) / 12.0 * 6.2831853;
  var radial = vec2f(0.0);
  if (vertex == 1u) { radial = vec2f(cos(angleA), sin(angleA)) * 0.5; }
  else if (vertex == 2u) { radial = vec2f(cos(angleB), sin(angleB)) * 0.5; }
  let y = select(-0.5, 0.5, top);
  return PropGeometry(vec3f(radial.x, y, radial.y), vec3f(0.0, select(-1.0, 1.0, top), 0.0), 1.0);
}

fn sphereGeometry(index: u32) -> PropGeometry {
  let longitudeSegments = 6u;
  let latitudeSegments = 6u;
  if (index >= longitudeSegments * latitudeSegments * 6u) {
    return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0);
  }
  let cell = index / 6u;
  let vertex = index % 6u;
  let longitude = cell % longitudeSegments;
  let latitude = cell / longitudeSegments;
  let uv = quadVertex(vertex) * 0.5 + 0.5;
  let theta = (f32(latitude) + uv.y) / f32(latitudeSegments) * 3.14159265;
  let phi = (f32(longitude) + uv.x) / f32(longitudeSegments) * 6.2831853;
  let normal = vec3f(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));
  return PropGeometry(normal * 0.5, normal, 1.0);
}

fn pyramidGeometry(index: u32) -> PropGeometry {
  if (index >= 18u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 1.0, 0.0), 0.0); }
  if (index >= 12u) {
    let uv = quadVertex(index - 12u) * 0.5;
    return PropGeometry(vec3f(uv.x, -0.5, -uv.y), vec3f(0.0, -1.0, 0.0), 1.0);
  }
  let face = index / 3u;
  let vertex = index % 3u;
  let corners = array<vec3f, 4>(
    vec3f(-0.5, -0.5, -0.5), vec3f(0.5, -0.5, -0.5),
    vec3f(0.5, -0.5, 0.5), vec3f(-0.5, -0.5, 0.5),
  );
  let first = corners[face];
  let second = corners[(face + 1u) % 4u];
  let peak = vec3f(0.0, 0.5, 0.0);
  let position = select(select(first, second, vertex == 1u), peak, vertex == 2u);
  let normal = normalize(cross(second - first, peak - first));
  return PropGeometry(position, normal, 1.0);
}

fn ribbonGeometry(index: u32) -> PropGeometry {
  if (index >= 6u) { return PropGeometry(vec3f(0.0), vec3f(0.0, 0.0, 1.0), 0.0); }
  let uv = quadVertex(index) * 0.5;
  return PropGeometry(vec3f(uv.x, uv.y, 0.0), vec3f(0.0, 0.0, 1.0), 1.0);
}

fn rotateEuler(value: vec3f, rotation: vec3f) -> vec3f {
  let pitchCos = cos(rotation.y);
  let pitchSin = sin(rotation.y);
  let pitched = vec3f(value.x, value.y * pitchCos - value.z * pitchSin, value.y * pitchSin + value.z * pitchCos);
  let rollCos = cos(rotation.z);
  let rollSin = sin(rotation.z);
  let rolled = vec3f(pitched.x * rollCos - pitched.y * rollSin, pitched.x * rollSin + pitched.y * rollCos, pitched.z);
  let yawCos = cos(rotation.x);
  let yawSin = sin(rotation.x);
  return vec3f(rolled.x * yawCos - rolled.z * yawSin, rolled.y, rolled.x * yawSin + rolled.z * yawCos);
}

@vertex
fn vertexMain(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32,
) -> PropOutput {
  var output: PropOutput;
  let data = props[instanceIndex];
  let primitive = u32(round(data.centerType.w));
  var geometry = boxGeometry(vertexIndex);
  if (primitive == 1u) { geometry = frustumGeometry(vertexIndex); }
  else if (primitive == 2u) { geometry = cylinderGeometry(vertexIndex); }
  else if (primitive == 3u) { geometry = sphereGeometry(vertexIndex); }
  else if (primitive == 4u) { geometry = pyramidGeometry(vertexIndex); }
  else if (primitive == 5u) { geometry = ribbonGeometry(vertexIndex); }

  let opacity = 1.0 - smoothstep(0.22, 0.58, uniforms.progress);
  output.normal = vec3f(0.0, 1.0, 0.0);
  output.material = u32(round(data.sizeMaterial.w));
  output.seed = data.rotationSeed.w;
  output.opacity = opacity;
  output.localHeight = geometry.position.y + 0.5;
  if (opacity < 0.02 || geometry.valid < 0.5) {
    output.position = vec4f(0.0, 0.0, -10.0, 1.0);
    output.opacity = 0.0;
    return output;
  }

  let rotation = data.rotationSeed.xyz;
  let scaled = geometry.position * data.sizeMaterial.xyz;
  let localPosition = data.centerType.xyz + rotateEuler(scaled, rotation);
  output.normal = normalize(rotateEuler(geometry.normal, rotation));
  output.position = projectPosition(localPosition);
  return output;
}

fn propMaterial(material: u32, seed: f32, normal: vec3f, localHeight: f32) -> vec4f {
  let variation = 0.92 + fract(seed * 17.31) * 0.12;
  var color = mix(uniforms.themeFourth.rgb, themeInk(), 0.34);
  var alpha = 1.0;
  if (material == 1u) {
    color = mix(uniforms.themeSecondary.rgb, uniforms.themeFourth.rgb, 0.28);
  } else if (material == 2u) {
    color = mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.48);
  } else if (material == 3u) {
    color = uniforms.themePrimary.rgb;
  } else if (material == 4u) {
    color = mix(uniforms.themeThird.rgb, themeInk(), 0.42);
  } else if (material == 5u) {
    color = mix(uniforms.themePrimary.rgb, uniforms.themeFifth.rgb, 0.64);
    alpha = 0.84;
  } else if (material == 6u) {
    color = themeInk();
  } else if (material == 7u) {
    color = mix(uniforms.themePrimary.rgb, uniforms.themeSecondary.rgb, 0.36);
    color = mix(color, uniforms.themeFifth.rgb, clamp(localHeight, 0.0, 1.0) * 0.22);
    alpha = 0.78;
  } else if (material == 8u) {
    color = themeBark(seed);
  } else if (material == 9u) {
    color = mix(uniforms.themeFifth.rgb, vec3f(1.0), 0.42);
  } else if (material == 10u) {
    color = mix(uniforms.themePrimary.rgb, vec3f(1.0), 0.5);
  } else if (material == 11u) {
    color = mix(uniforms.themeThird.rgb, uniforms.themeFifth.rgb, 0.25 + fract(seed * 9.13) * 0.22);
  }
  let sunDirection = normalize(vec3f(-0.405616, 0.861934, -0.304212));
  let diffuse = max(dot(normal, sunDirection), 0.0);
  let sky = max(normal.y, 0.0) * 0.11;
  var lighting = 0.58 + diffuse * 0.38 + sky;
  if (material == 10u) { lighting = 1.12; }
  return vec4f(clamp(color * variation * lighting, vec3f(0.0), vec3f(1.0)), alpha);
}

@fragment
fn fragmentMain(input: PropOutput) -> @location(0) vec4f {
  if (input.opacity < 0.02) { discard; }
  let material = propMaterial(input.material, input.seed, normalize(input.normal), input.localHeight);
  let alpha = input.opacity * material.a;
  if (alpha < 0.02) { discard; }
  return vec4f(material.rgb, alpha);
}
`;

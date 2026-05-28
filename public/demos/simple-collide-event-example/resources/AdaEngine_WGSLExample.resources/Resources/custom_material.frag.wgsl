// Generated from GLSL by AdaShaderTranspilerTool.
struct VertexOut {
  UV : vec2f,
}

struct CustomMaterial {
  /* @offset(0) */
  u_Color : vec4f,
  /* @offset(16) */
  u_Time : f32,
}

var<private> COLOR : vec4f;

@group(1) @binding(0) var customTexture : texture_2d<f32>;

@group(1) @binding(1) var u_Sampler : sampler;

var<private> Input : VertexOut;

@group(0) @binding(0) var<uniform> customMaterial : CustomMaterial;

fn main_1() {
  COLOR = (textureSample(customTexture, u_Sampler, Input.UV) * customMaterial.u_Color);
  COLOR.z = sin(customMaterial.u_Time);
  return;
}

struct main_out {
  @location(0)
  COLOR_1 : vec4f,
}

@fragment
fn my_material_fragment(@location(0) Input_param : vec2f) -> main_out {
  Input.UV = Input_param;
  main_1();
  return main_out(COLOR);
}

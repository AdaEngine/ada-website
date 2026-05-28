// Generated from GLSL by AdaShaderTranspilerTool.
struct AE_Mesh2dUniform {
  /* @offset(0) */
  u_MeshModel : mat4x4f,
  /* @offset(64) */
  u_MeshInverseTransposeModel : mat4x4f,
}

struct VertexOut {
  UV : vec2f,
}

struct AE_GlobalView {
  /* @offset(0) */
  u_Projection : mat4x4f,
  /* @offset(64) */
  u_ViewProjection : mat4x4f,
  /* @offset(128) */
  u_ViewMatrix : mat4x4f,
}

@group(0) @binding(3) var<uniform> x_13 : AE_Mesh2dUniform;

var<private> a_Position : vec3f;

var<private> Output : VertexOut;

var<private> a_UV : vec2f;

@group(0) @binding(2) var<uniform> x_46 : AE_GlobalView;

var<private> gl_Position : vec4f;

fn main_1() {
  var worldPosition : vec4f;
  worldPosition = (x_13.u_MeshModel * vec4f(a_Position.x, a_Position.y, a_Position.z, 1.0f));
  Output.UV = a_UV;
  gl_Position = (x_46.u_ViewProjection * worldPosition);
  return;
}

struct main_out {
  @location(0)
  Output_1 : vec2f,
  @builtin(position)
  gl_Position : vec4f,
}

@vertex
fn custom_material_vertex(@location(0) a_Position_param : vec3f, @location(2) a_UV_param : vec2f) -> main_out {
  a_Position = a_Position_param;
  a_UV = a_UV_param;
  main_1();
  return main_out(Output.UV, gl_Position);
}

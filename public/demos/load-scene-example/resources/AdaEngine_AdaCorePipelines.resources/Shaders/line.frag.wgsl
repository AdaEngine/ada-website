// Generated from GLSL by AdaShaderTranspilerTool.
struct VertexOutput {
  Color : vec4f,
}

var<private> color : vec4f;

var<private> Input : VertexOutput;

fn main_1() {
  color = Input.Color;
  return;
}

struct main_out {
  @location(0)
  color_1 : vec4f,
}

@fragment
fn line_fragment(@location(0) Input_param : vec4f) -> main_out {
  Input.Color = Input_param;
  main_1();
  return main_out(color);
}

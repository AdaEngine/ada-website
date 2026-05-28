// Generated from GLSL by AdaShaderTranspilerTool.
@group(0) @binding(0) var u_FontAtlas : texture_2d<f32>;

@group(0) @binding(1) var u_FontSampler : sampler;

var<private> v_TexCoordinate : vec2f;

var<private> v_ForegroundColor : vec4f;

var<private> v_OutlineColor : vec4f;

var<private> v_OutlineWidth : f32;

var<private> color : vec4f;

fn Median_vf3_(msd : ptr<function, vec3f>) -> f32 {
  let x_63 = (*(msd)).x;
  let x_66 = (*(msd)).y;
  let x_69 = (*(msd)).x;
  let x_71 = (*(msd)).y;
  let x_75 = (*(msd)).z;
  return max(min(x_63, x_66), min(max(x_69, x_71), x_75));
}

fn ScreenPxRange_() -> f32 {
  var pxRange : f32;
  var textureSize : vec2i;
  var unitRange : vec2f;
  var screenTexSize : vec2f;
  pxRange = 2.0f;
  textureSize = vec2i(textureDimensions(u_FontAtlas, 0i));
  unitRange = (vec2f(pxRange) / vec2f(textureSize));
  screenTexSize = (vec2f(1.0f) / fwidth(v_TexCoordinate));
  let x_53 = unitRange;
  let x_54 = screenTexSize;
  return max((0.5f * dot(x_53, x_54)), 1.0f);
}

fn main_1() {
  var fgColor : vec4f;
  var outlineColor : vec4f;
  var msd_1 : vec3f;
  var sd : f32;
  var param : vec3f;
  var pxDistance : f32;
  var fillAlpha : f32;
  var outlineAlpha : f32;
  var outlinedGlyph : vec4f;
  fgColor = v_ForegroundColor;
  outlineColor = v_OutlineColor;
  msd_1 = textureSample(u_FontAtlas, u_FontSampler, v_TexCoordinate).xyz;
  param = msd_1;
  let x_99 = Median_vf3_(&(param));
  sd = x_99;
  let x_101 = ScreenPxRange_();
  pxDistance = (x_101 * (sd - 0.5f));
  fillAlpha = clamp((pxDistance + 0.5f), 0.0f, 1.0f);
  outlineAlpha = (clamp(((pxDistance + v_OutlineWidth) + 0.5f), 0.0f, 1.0f) * outlineColor.w);
  let x_124 = outlineColor.xyz;
  outlinedGlyph = mix(vec4f(x_124.x, x_124.y, x_124.z, 0.0f), outlineColor, vec4f(outlineAlpha));
  color = mix(outlinedGlyph, fgColor, vec4f((fillAlpha * fgColor.w)));
  return;
}

struct main_out {
  @location(0)
  color_1 : vec4f,
}

@fragment
fn text_fragment(@location(3) v_TexCoordinate_param : vec2f, @location(0) v_ForegroundColor_param : vec4f, @location(1) v_OutlineColor_param : vec4f, @location(2) v_OutlineWidth_param : f32) -> main_out {
  v_TexCoordinate = v_TexCoordinate_param;
  v_ForegroundColor = v_ForegroundColor_param;
  v_OutlineColor = v_OutlineColor_param;
  v_OutlineWidth = v_OutlineWidth_param;
  main_1();
  return main_out(color);
}

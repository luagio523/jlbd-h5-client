// glow-effect.vert
// 顶点着色器
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 v_uv0;

void main() {
    gl_Position = viewProj * vec4(a_position, 1.0);
    v_uv0 = a_uv0;
}

// glow-effect.frag
// 片段着色器
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec4 color;
uniform float glowIntensity;
varying vec2 v_uv0;

void main() {
    vec4 texColor = texture2D(texture, v_uv0);
    float alpha = texColor.a * glowIntensity;
    vec4 glowColor = vec4(color.rgb, alpha);
    gl_FragColor = texColor + glowColor;
}

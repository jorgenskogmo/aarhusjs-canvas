#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {

    float m = abs(sin(u_mouse.x / u_resolution.x));

    gl_FragColor = vec4(m,0.,.3,1.0);

}
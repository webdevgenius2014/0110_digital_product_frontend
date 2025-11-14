uniform sampler2D uTexture;
uniform float uTextureHeight;
uniform float uMeshHeight;
uniform float uScreenHeight;
uniform float uScrollY;

varying vec2 vUv;

void main() {

  vec2 uv = vUv;
  
  float sizeY = uMeshHeight / uTextureHeight;
  float scrollY = 1.0 - uScrollY / uTextureHeight;
  float offsetY = 1.0 - (uScrollY + uScreenHeight) / uTextureHeight;

  uv.y = offsetY + uv.y * sizeY;
  

  vec3 page = texture2D(uTexture, uv).rgb;
  // page = vec3(vUv, 1.0);

  gl_FragColor = vec4(page, 1.0);

}

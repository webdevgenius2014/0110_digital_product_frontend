uniform sampler2D uTexture;
uniform sampler2D uDebug;
uniform vec2 uScreenSizes;
uniform vec2 uCardSizes;
uniform vec2 uCardPosition;
uniform float uRefractiveIndex;
uniform float uChromaticAberration;

varying vec2 vUv;

vec2 mirrorUV(vec2 uv) {
    uv = mod(uv, 2.0);                // wrap to [0,2]
    uv = mix(2.0 - uv, uv, step(uv, vec2(1.0))); // mirror second half
    return uv;
}

vec2 clipCardTexture(vec2 uv) {
  vec2 cardSize = uCardSizes / uScreenSizes;

  vec2 cardPosition = uCardPosition / uScreenSizes;
  cardPosition.y = 1.0 - cardPosition.y;

  vec2 cardUv = vec2(0.0);

  float x = uv.x - 0.5;
  float y = uv.y - 0.5;

  cardUv.x = cardPosition.x + cardSize.x * x;
  cardUv.y = cardPosition.y + cardSize.y * y;

  return cardUv;
}

void main() {

  // Vector from screen center
  vec2 m2 = vUv - 0.5;

  // Distortion
  vec2 distorted = (vUv - 0.5) * (1.0 + (uRefractiveIndex - 1.0)) + 0.5;
  vec2 caOffset = uChromaticAberration * m2;

  // Simple box blur to smooth the effect
  vec3 col = vec3(0.0);
  float total = 0.0;
  for (float x = -4.0; x <= 4.0; x++) {
    for (float y = -4.0; y <= 4.0; y++) {
      vec2 offset = vec2(x, y) * 0.5 / uScreenSizes.xy;
      col.r += texture2D(uDebug, mirrorUV(distorted + offset + caOffset)).r;
      col.g += texture2D(uDebug, mirrorUV(distorted + offset)).g;
      col.b += texture2D(uDebug, mirrorUV(distorted + offset - caOffset)).b;
      total += 1.0;
    }
  }
  col /= total;


  // vec2 cardUv = clipCardTexture(vUv);
  // vec3 card = texture2D(uTexture, cardUv).rgb;
  // gl_FragColor = vec4(card, 1.0);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>

}




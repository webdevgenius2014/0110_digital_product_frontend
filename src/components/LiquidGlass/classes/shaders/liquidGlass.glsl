vec2 mirrorUV(vec2 uv) {
    uv = mod(uv, 2.0);                // wrap to [0,2]
    uv = mix(2.0 - uv, uv, step(uv, vec2(1.0))); // mirror second half
    return uv;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // === Parameters ===
    float refractiveIndex = 1.5;       // lens strength
    float chromaticAberration = 0.08;  // color fringing

    // Normalized pixel coordinates (0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

    // Vector from screen center
    vec2 m2 = uv - 0.5;

    // Distortion
    vec2 distorted = (uv - 0.5) * (1.0 + (refractiveIndex - 1.0)) + 0.5;
    vec2 caOffset = chromaticAberration * m2;

    // Simple box blur to smooth the effect
    vec3 col = vec3(0.0);
    float total = 0.0;
    for (float x = -2.0; x <= 2.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
            vec2 offset = vec2(x, y) * 0.5 / iResolution.xy;

            col.r += texture(iChannel0, mirrorUV(distorted + offset + caOffset)).r;
            col.g += texture(iChannel0, mirrorUV(distorted + offset)).g;
            col.b += texture(iChannel0, mirrorUV(distorted + offset - caOffset)).b;


            total += 1.0;
        }
    }
    col /= total;

    fragColor = vec4(col, 1.0);
}

precision mediump float;

varying vec3 vNormal;

uniform vec3 uDiffuse;
uniform vec3 uReverseLightDirection;

void main(){
    vec3 normal = normalize(vNormal);

    float light = max(dot(normal, uReverseLightDirection), 0.0);

    gl_FragColor = vec4(uDiffuse * 0.5 + uDiffuse * light, 1.0);
}
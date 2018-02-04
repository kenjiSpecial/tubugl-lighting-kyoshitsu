precision mediump float;

varying vec3 vNormal;

const vec3 uDiffuse = vec3(1.0, 0.0, 0.0);
uniform vec3 uReverseLightDirection;

void main(){
    vec3 normal = normalize(vNormal);

    float light = dot(normal, uReverseLightDirection);

    gl_FragColor = vec4(uDiffuse * light, 1.0);
}
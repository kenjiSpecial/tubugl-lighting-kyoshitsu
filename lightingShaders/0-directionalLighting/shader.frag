precision mediump float;

varying vec3 vNormal;

// uniform vec3 uReverseLightDirection;
// uniform vec3 uDiffuse;

const vec3 uDiffuse = vec3(1.0, 0.0, 0.0);
const vec3 uReverseLightDirection = vec3(1.0, 1.0, 0.0);

void main(){
    vec3 normal = normalize(vNormal);

    float light = dot(normal, uReverseLightDirection);

    gl_FragColor = vec4(uDiffuse * light, 1.0);
}
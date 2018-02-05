precision mediump float;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;
varying vec3 vSurfacetoView;

uniform vec3 uDiffuse;
uniform float uShininess;

void main(){
    vec3 normal = normalize(vNormal);
    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
    vec3 surfaceToViewDirection = normalize(vSurfacetoView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float light = max(dot(normal, surfaceToLightDirection), 0.0);
    float specular = 0.;
    if(light > 0.){
        specular = pow(max(dot(normal, halfVector), 0.0), uShininess );
    }
    gl_FragColor = vec4(uDiffuse * light + vec3(specular), 1.0);
}
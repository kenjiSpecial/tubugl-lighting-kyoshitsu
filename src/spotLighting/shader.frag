precision mediump float;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;
varying vec3 vSurfacetoView;

uniform vec3 uDiffuse;
uniform float uShininess;

uniform vec3 uLightDirection;
// uniform float uLimit;
uniform float uInnerLimit;
uniform float uOuterLimit;


void main(){
    vec3 normal = normalize(vNormal);
    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
    vec3 surfaceToViewDirection = normalize(vSurfacetoView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float dotFromDirection = dot(surfaceToLightDirection, -uLightDirection);
    float inLight = smoothstep(uOuterLimit, uInnerLimit, dotFromDirection);
    float light = inLight * dot(normal, surfaceToLightDirection);
    float specular = inLight * pow( max(dot(normal, halfVector), 0.0), uShininess);

    gl_FragColor = vec4(uDiffuse, 1.0);

    gl_FragColor.rgb *= light;
    gl_FragColor.rgb += specular;
}
precision mediump float;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;
varying vec3 vSurfacetoView;

uniform vec3 uDiffuse;
uniform float uShininess;
uniform vec3 uLightColor;
uniform vec3 uSpecularColor;

void main(){
    vec3 normal = normalize(vNormal);
    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
    vec3 surfaceToViewDirection = normalize(vSurfacetoView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float light = dot(normal, surfaceToLightDirection);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), uShininess);
    }

    gl_FragColor = vec4(uDiffuse, 1.0);
    gl_FragColor.rgb *= light * uLightColor;
    gl_FragColor.rgb +=   specular * uSpecularColor;

    // gl_FragColor.rgb = vec3(1.0)/2.0 + surfaceToViewDirection/2.0;
}
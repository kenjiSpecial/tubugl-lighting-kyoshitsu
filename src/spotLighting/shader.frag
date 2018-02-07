precision mediump float;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;
varying vec3 vSurfacetoView;

uniform vec3 uDiffuse;
uniform float uShininess;

uniform vec3 uLightDirection;
uniform float uLimit;


void main(){
    vec3 normal = normalize(vNormal);
    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
    vec3 surfaceToViewDirection = normalize(vSurfacetoView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float light = 0.0;
    float specular = 0.0;

    float dotFromDirection = dot(surfaceToLightDirection, -uLightDirection);

    if(dotFromDirection >= uLimit){
        light = max(dot(vNormal, surfaceToLightDirection), 0.0);
        specular = max(pow(dot(vNormal, halfVector), uShininess), 0.0);
    }

    gl_FragColor = vec4(uDiffuse, 1.0);

    gl_FragColor.rgb *= light;
    gl_FragColor.rgb += specular;
    
}
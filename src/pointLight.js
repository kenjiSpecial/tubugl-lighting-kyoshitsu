import { vec3 } from 'gl-matrix';

export class PointLight {
	constructor(xx = 0, yy = 0, zz = 0, shininess = 12) {
		this.shininess = shininess;
		this.position = vec3.create();
		vec3.set(this.position, xx, yy, zz);
	}
}

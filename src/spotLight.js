import { vec3 } from 'gl-matrix';
import { mathUtils } from 'tubugl-utils';

export class SpotLight {
	constructor(xx = 0, yy = 0, zz = 0, shininess = 12, limitDegree = 20) {
		this.shininess = shininess;
		this.position = vec3.create();
		vec3.set(this.position, xx, yy, zz);
		this.limitDegree = limitDegree;
	}

	get limitDegree() {
		return this._limitValue;
	}

	set limitDegree(value) {
		this._limitValue = value;
		this.limitValue = Math.cos(degToRad(this._limitValue));
	}
}

function degToRad(value) {
	// Math.PI / 180 = 0.017453292519943295
	return value * 0.017453292519943295;
}

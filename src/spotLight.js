import { vec3 } from 'gl-matrix';

export class SpotLight {
	constructor(
		xx = 0,
		yy = 0,
		zz = 0,
		shininess = 30,
		innerLimitDegree = 20,
		outerLimitDegree = 30
	) {
		this.shininess = shininess;
		this.position = vec3.create();
		this.lightDirection = vec3.create();
		vec3.set(this.position, xx, yy, zz);

		this.innerLimitDegree = innerLimitDegree;
		this.outerLimitDegree = outerLimitDegree;
	}

	get outerLimitDegree() {
		return this._outerLimitValue;
	}

	set outerLimitDegree(value) {
		this._outerLimitValue = value;
		this.outerLimitValue = Math.cos(degToRad(this._outerLimitValue));
	}

	get innerLimitDegree() {
		return this._innerLimitValue;
	}

	set innerLimitDegree(value) {
		this._innerLimitValue = value;
		this.innerLimitValue = Math.cos(degToRad(this._innerLimitValue));
	}
}

function degToRad(value) {
	// Math.PI / 180 = 0.017453292519943295
	return value * 0.017453292519943295;
}

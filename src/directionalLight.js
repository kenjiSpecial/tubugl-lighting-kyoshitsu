import { Vector3 } from 'tubugl-math';
import { vec3 } from 'gl-matrix';

export class DirectionalLight {
	constructor(xx = 0, yy = 0, zz = 0) {
		this.direction = new Vector3(xx, yy, zz);
		this._position = vec3.create();
	}

	setLightPosition(xx = 0, yy = 0, zz = 0) {
		this._position[0] = xx;
		this._position[1] = yy;
		this._position[2] = zz;

		let dir = vec3.create();
		vec3.normalize(dir, this._position);

		dir[0] *= -1;
		dir[1] *= -1;
		dir[2] *= -1;

		this.direction.setArray(dir);
	}
}

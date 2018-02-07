import { Plane } from 'tubugl-2d-shape';
import { Cylinder, Cone } from 'tubugl-3d-shape';
import { vec3, mat4 } from 'gl-matrix';
import { Sphere } from 'tubugl-3d-shape/src/sphere';
const fragmentShaderSrc = `precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

import { mathUtils } from 'tubugl-utils';

export class PointLightHelper {
	constructor(gl, params = {}, pointLight) {
		this._gl = gl;
		this._pointLight = pointLight;

		this._rad = params.rad ? params.rad : 500;

		this._sphere = new Sphere(
			this._gl,
			{
				disableUpdateModelMatrix: true,
				fragmentShaderSrc: fragmentShaderSrc
			},
			12,
			10,
			10
		);

		this._theta = 0;
		this._phi = Math.PI / 2;

		this.position = vec3.create();
		this.updatePosition();
	}

	updatePosition() {
		let sinPhiRadius = Math.sin(this._phi) * this._rad;
		this.position[0] = sinPhiRadius * Math.sin(this._theta);
		this.position[1] = Math.cos(this._phi) * this._rad;
		this.position[2] = sinPhiRadius * Math.cos(this._theta);

		let _mat4 = mat4.create();
		mathUtils.lookAtCustom(_mat4, this.position, [0, 0, 0], [0, 1, 0]);

		mat4.invert(_mat4, _mat4);

		this._sphere.updateModelMatrix(_mat4);
		vec3.copy(this._pointLight.position, this.position);
	}

	render(camera) {
		this._sphere.render(camera);
	}

	resize() {}

	addGui(gui) {
		let pointLightFolder = gui.addFolder('Point Light');
		pointLightFolder.add(this._pointLight, 'shininess', 2.0, 100.0);
		pointLightFolder
			.add(this, '_theta', 0, 2 * Math.PI)
			.step(0.01)
			.name('theta')
			.onChange(() => {
				this.updatePosition();
			});

		pointLightFolder
			.add(this, '_phi', 0, Math.PI)
			.step(0.01)
			.name('phi')
			.onChange(() => {
				this.updatePosition();
			});

		pointLightFolder.addColor(this._pointLight, 'lightColor');
		pointLightFolder.addColor(this._pointLight, 'specularColor');
	}
}

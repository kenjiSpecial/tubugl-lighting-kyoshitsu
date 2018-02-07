import { vec3, mat4 } from 'gl-matrix';
import { Sphere } from 'tubugl-3d-shape/src/sphere';
const fragmentShaderSrc = `precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

import { mathUtils } from 'tubugl-utils';

export class SpotLightHelper {
	constructor(gl, params = {}, spotLight) {
		this._gl = gl;
		this._spotLight = spotLight;

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

		// this._cylinder = new Cylinder(
		// 	this._gl,
		// 	{
		// 		isWire: false,
		// 		disableUpdateModelMatrix: true,
		// 		fragmentShaderSrc: fragmentShaderSrc
		// 	},
		// 	3,
		// 	3,
		// 	100,
		// 	12
		// );
		// this._cone = new Cone(
		// 	this._gl,
		// 	{
		// 		disableUpdateModelMatrix: true,
		// 		fragmentShaderSrc: fragmentShaderSrc
		// 	},
		// 	8,
		// 	10,
		// 	12
		// );

		/**
		this._cylinderLocalModelMatrix = mat4.create();
		let transY = mat4.create();
		mat4.fromTranslation(transY, [0, 0, -50.5]);
		mat4.fromXRotation(this._cylinderLocalModelMatrix, Math.PI / 2);
		mat4.multiply(this._cylinderLocalModelMatrix, transY, this._cylinderLocalModelMatrix);

		this._coneLocalModelMatrix = mat4.create();
		let coneTransY = mat4.create();
		mat4.fromTranslation(coneTransY, [0, 0, -105]);
		mat4.fromXRotation(this._coneLocalModelMatrix, -Math.PI / 2);
		mat4.multiply(this._coneLocalModelMatrix, coneTransY, this._coneLocalModelMatrix);

		this._cylinderModelMatrix = mat4.create();
		*/

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
		console.log(this.position);

		mat4.invert(_mat4, _mat4);

		this._sphere.updateModelMatrix(_mat4);
		vec3.copy(this._spotLight.position, this.position);
	}

	render(camera) {
		this._sphere.render(camera);
		/**
		mat4.multiply(
			this._cylinder.modelMatrix,
			this._sphere.modelMatrix,
			this._cylinderLocalModelMatrix
		);
		this._cylinder.render(camera);

		mat4.multiply(this._cone.modelMatrix, this._sphere.modelMatrix, this._coneLocalModelMatrix);
		this._cone.render(camera); */
	}

	resize() {}

	addGui(gui) {
		/**
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
		pointLightFolder.addColor(this._pointLight, 'specularColor'); */

		let spotLightFolder = gui.addFolder('Spot Light');
		spotLightFolder.add(this._spotLight, 'shininess', 2.0, 100.0);
		spotLightFolder
			.add(this, '_theta', 0, 2 * Math.PI)
			.step(0.01)
			.name('theta')
			.onChange(() => {
				this.updatePosition();
			});

		spotLightFolder
			.add(this, '_phi', 0, Math.PI)
			.step(0.01)
			.name('phi')
			.onChange(() => {
				this.updatePosition();
			});
	}
}

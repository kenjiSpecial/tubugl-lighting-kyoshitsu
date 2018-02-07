import { vec3, mat4 } from 'gl-matrix';
import { Sphere } from 'tubugl-3d-shape/src/sphere';
const fragmentShaderSrc = `precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

import { mathUtils } from 'tubugl-utils';
import { Cylinder } from 'tubugl-3d-shape/src/cylinder';
import { Cone } from 'tubugl-3d-shape/src/cone';
import { Program, ArrayBuffer, IndexArrayBuffer, VAO } from 'tubugl-core';
import {
	LINES,
	UNSIGNED_SHORT,
	DEPTH_TEST,
	BLEND,
	ONE_MINUS_SRC_ALPHA,
	SRC_ALPHA,
	CULL_FACE
} from 'tubugl-constants';

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

		this._cylinderHeight = 200;
		this._cylinder = new Cylinder(
			this._gl,
			{
				isWire: false,
				disableUpdateModelMatrix: true,
				fragmentShaderSrc: fragmentShaderSrc
			},
			3,
			3,
			this._cylinderHeight,
			12
		);
		this._cone = new Cone(
			this._gl,
			{
				disableUpdateModelMatrix: true,
				fragmentShaderSrc: fragmentShaderSrc
			},
			8,
			10,
			12
		);

		this._spotLightHelperShape = new SpotLightHelperShape(this._gl, this._spotLight, 1000);

		this._cylinderLocalModelMatrix = mat4.create();
		let transY = mat4.create();
		mat4.fromTranslation(transY, [0, 0, -this._cylinderHeight / 2 - 0.5]);
		mat4.fromXRotation(this._cylinderLocalModelMatrix, Math.PI / 2);
		mat4.multiply(this._cylinderLocalModelMatrix, transY, this._cylinderLocalModelMatrix);

		this._coneLocalModelMatrix = mat4.create();
		let coneTransY = mat4.create();
		mat4.fromTranslation(coneTransY, [0, 0, -this._cylinderHeight - 5]);
		mat4.fromXRotation(this._coneLocalModelMatrix, -Math.PI / 2);
		mat4.multiply(this._coneLocalModelMatrix, coneTransY, this._coneLocalModelMatrix);

		this._cylinderModelMatrix = mat4.create();

		this._theta = 0;
		this._phi = Math.PI / 2;

		this._lightDirection = {
			theta: Math.PI,
			phi: Math.PI / 2
		};

		this.position = vec3.create();
		this.lightDirection = vec3.create();
		this.trans = { x: -150, y: 0 };

		this.updatePosition();
		this.updateLightDirection();
	}

	updatePosition() {
		let sinPhiRadius = Math.sin(this._phi) * this._rad;
		this.position[0] = sinPhiRadius * Math.sin(this._theta) + this.trans.x;
		this.position[1] = Math.cos(this._phi) * this._rad + this.trans.y;
		this.position[2] = sinPhiRadius * Math.cos(this._theta);

		let _mat4 = mat4.create();
		mathUtils.lookAtCustom(_mat4, this.position, [0, 0, 0], [0, 1, 0]);

		mat4.invert(_mat4, _mat4);

		this._sphere.updateModelMatrix(_mat4);
		vec3.copy(this._spotLight.position, this.position);
	}

	updateLightDirection() {
		this.lightDirection[0] =
			Math.sin(this._lightDirection.phi) * Math.sin(this._lightDirection.theta);
		this.lightDirection[1] = Math.cos(this._lightDirection.phi);
		this.lightDirection[2] =
			Math.sin(this._lightDirection.phi) * Math.cos(this._lightDirection.theta);
		vec3.copy(this._spotLight.lightDirection, this.lightDirection);

		this._cylinderLocalModelMatrix = mat4.create();
		let transY = mat4.create();
		mat4.fromTranslation(transY, [0, this._cylinderHeight / 2 + 0.5, 0]);
		let rotY = mat4.create();
		mat4.fromYRotation(rotY, this._lightDirection.theta);

		mat4.fromXRotation(this._cylinderLocalModelMatrix, this._lightDirection.phi);
		mat4.multiply(this._cylinderLocalModelMatrix, rotY, this._cylinderLocalModelMatrix);
		mat4.multiply(this._cylinderLocalModelMatrix, this._cylinderLocalModelMatrix, transY);

		this._coneLocalModelMatrix = mat4.create();
		let coneTransY = mat4.create();
		mat4.fromTranslation(coneTransY, [0, this._cylinderHeight + 5, 0]);
		mat4.fromXRotation(this._coneLocalModelMatrix, this._lightDirection.phi);
		mat4.multiply(this._coneLocalModelMatrix, rotY, this._coneLocalModelMatrix);
		mat4.multiply(this._coneLocalModelMatrix, this._coneLocalModelMatrix, coneTransY);

		this._cylinderLocalModelMatrix[12] += this.position[0];
		this._cylinderLocalModelMatrix[13] += this.position[1];
		this._cylinderLocalModelMatrix[14] += this.position[2];

		mat4.copy(this._cylinder.modelMatrix, this._cylinderLocalModelMatrix);

		this._coneLocalModelMatrix[12] += this.position[0];
		this._coneLocalModelMatrix[13] += this.position[1];
		this._coneLocalModelMatrix[14] += this.position[2];

		mat4.copy(this._cone.modelMatrix, this._coneLocalModelMatrix);

		this._spotLightHelperShape.updateModel(
			this._lightDirection.theta,
			this._lightDirection.phi
		);
	}

	render(camera) {
		this._sphere.render(camera);
		this._cylinder.render(camera);
		this._cone.render(camera);
		this._spotLightHelperShape.render(camera);
	}

	resize() {}

	addGui(gui) {
		let spotLightFolder = gui.addFolder('Spot Light');
		spotLightFolder.add(this._spotLight, 'shininess', 2.0, 100.0);

		let spotLightPosition = spotLightFolder.addFolder('position');

		spotLightPosition
			.add(this, '_theta', 0, 2 * Math.PI)
			.step(0.01)
			.name('theta')
			.onChange(() => {
				this.updatePosition();
				this.updateLightDirection();
			});

		spotLightPosition
			.add(this, '_phi', 0, Math.PI)
			.step(0.01)
			.name('phi')
			.onChange(() => {
				this.updatePosition();
				this.updateLightDirection();
			});

		spotLightPosition
			.add(this.trans, 'x', -200, 200)
			.name('transX')
			.onChange(() => {
				this.updatePosition();
				this.updateLightDirection();
			});

		spotLightPosition
			.add(this.trans, 'y', -200, 200)
			.name('transY')
			.onChange(() => {
				this.updatePosition();
				this.updateLightDirection();
			});

		let spotLightDirectionFolder = spotLightFolder.addFolder('light direction');
		spotLightDirectionFolder
			.add(this._lightDirection, 'theta', 0, 2 * Math.PI)
			.step(0.01)
			.onChange(() => {
				this.updateLightDirection();
			});

		spotLightDirectionFolder
			.add(this._lightDirection, 'phi', 0, Math.PI)
			.step(0.01)
			.onChange(() => {
				this.updateLightDirection();
			});

		spotLightFolder.add(this._spotLight, 'innerLimitDegree', 0, 180);
		spotLightFolder.add(this._spotLight, 'outerLimitDegree', 0, 180);
	}
}

class SpotLightHelperShape {
	constructor(gl, spotLight, distance = 100) {
		this._gl = gl;
		this._spotLight = spotLight;
		this.modelMatrix = mat4.create();
		this.distance = distance;

		this._makeProgram();
		this._makeBuffers();
	}
	_makeProgram() {
		const vertexShaderSrc = `attribute vec4 position;
		uniform mat4 projectionMatrix;
		uniform mat4 viewMatrix;
		uniform mat4 modelMatrix;
		
		uniform vec3 uLightPosition;
		uniform float uDistance;
		uniform float uLimitDeg;
		
		void main() {
			float side = tan(uLimitDeg) * uDistance;
			vec4 pos = vec4(position.x * side, position.y * uDistance, position.z * side, position.w);
			gl_Position = projectionMatrix * viewMatrix * ( modelMatrix * pos + vec4( uLightPosition, 0.0 ) );
			gl_PointSize = 10.;
		}`;
		const fragmentShaderSrc = `
		precision mediump float;
		
		uniform vec3 uDiffuse;
		
		void main() {
			gl_FragColor = vec4(uDiffuse, 1.0);
		}`;

		console.log(this._gl);
		this._program = new Program(this._gl, vertexShaderSrc, fragmentShaderSrc);
	}
	_makeBuffers() {
		let pos = new Float32Array([0, 0, 0, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1]);
		let indices = new Uint16Array([0, 1, 0, 2, 0, 3, 0, 4, 1, 2, 2, 3, 3, 4, 4, 1, 1, 3]);

		this._positionBuffer = new ArrayBuffer(this._gl, pos);
		this._positionBuffer.setAttribs('position', 3);

		this._indexBuffer = new IndexArrayBuffer(this._gl, indices);

		this._cnt = this._indexBuffer.dataArray.length;
	}

	render(camera) {
		this.update(camera).draw();
		this.updateInside().draw();
	}

	update(camera) {
		this._program.use();

		this._positionBuffer.bind().attribPointer(this._program);
		this._indexBuffer.bind();

		this._gl.uniformMatrix4fv(
			this._program.getUniforms('modelMatrix').location,
			false,
			this.modelMatrix
		);
		this._gl.uniformMatrix4fv(
			this._program.getUniforms('viewMatrix').location,
			false,
			camera.viewMatrix
		);
		this._gl.uniformMatrix4fv(
			this._program.getUniforms('projectionMatrix').location,
			false,
			camera.projectionMatrix
		);

		this._gl.uniform3f(this._program.getUniforms('uDiffuse').location, 0, 0, 1);

		this._gl.uniform1f(
			this._program.getUniforms('uLimitDeg').location,
			this._spotLight.outerLimitDegree / 180 * Math.PI
		);
		this._gl.uniform1f(this._program.getUniforms('uDistance').location, this.distance);
		this._gl.uniform3f(
			this._program.getUniforms('uLightPosition').location,
			this._spotLight.position[0],
			this._spotLight.position[1],
			this._spotLight.position[2]
		);

		return this;
	}

	updateInside() {
		this._gl.uniform3f(this._program.getUniforms('uDiffuse').location, 0, 1, 0);

		this._gl.uniform1f(
			this._program.getUniforms('uLimitDeg').location,
			this._spotLight.innerLimitDegree / 180 * Math.PI
		);
		return this;
	}

	updateModel(theta, phi) {
		let rotYMat = mat4.create();

		mat4.fromYRotation(rotYMat, theta);
		mat4.fromXRotation(this.modelMatrix, phi);
		mat4.multiply(this.modelMatrix, rotYMat, this.modelMatrix);
	}

	draw() {
		this._gl.disable(CULL_FACE);
		this._gl.blendFunc(SRC_ALPHA, ONE_MINUS_SRC_ALPHA);
		this._gl.enable(BLEND);
		this._gl.enable(DEPTH_TEST);

		this._gl.drawElements(LINES, this._cnt, UNSIGNED_SHORT, 0);
	}
}

const dat = require('../vendors/dat.gui.min');
const TweenLite = require('gsap/src/uncompressed/TweenLite');
const Stats = require('stats.js');

import { Program, ArrayBuffer, IndexArrayBuffer } from 'tubugl-core';
import { Sphere } from 'tubugl-3d-shape/src/sphere';
import { PerspectiveCamera, CameraController } from 'tubugl-camera';
import vertexShader from './components/shaders/shader.vert';
import fragmentShader from './components/shaders/shader.frag';
import { DEPTH_TEST } from 'tubugl-constants';

export default class App {
	constructor(params = {}) {
		this._isMouseDown = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;

		this.canvas = document.createElement('canvas');
		this.gl = this.canvas.getContext('webgl');

		if (params.isDebug) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
			this._addGui();
		} else {
			let descId = document.getElementById('tubugl-desc');
			descId.style.display = 'none';
		}

		this._setClearConfig();
		this._makeCamera();
		this._makeCameraController();
		this._makeSphere();
		this.resize(this._width, this._height);
	}

	_addGui() {
		this.gui = new dat.GUI();
		this.playAndStopGui = this.gui.add(this, '_playAndStop').name('pause');
	}

	_setClearConfig() {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(DEPTH_TEST);
	}

	_makeCamera() {
		this._camera = new PerspectiveCamera(window.innerWidth, window.innerHeight, 60, 1, 2000);
		this._camera.position.z = 600;
		this._camera.position.x = -600;
		this._camera.position.y = 200;
		this._camera.lookAt([0, 0, 0]);
	}

	_makeCameraController() {
		this._cameraController = new CameraController(this._camera, this.canvas);
		this._cameraController.minDistance = 300;
		this._cameraController.maxDistance = 1000;
	}

	_makeSphere() {
		let side = 150;
		this._sphere = new Sphere(this.gl, { isWire: true }, side, 15, 15);
		this._sphere.position.y = side + 50;
		this._sphere.position.x = side + 50;
	}

	_createProgram() {
		this._program = new Program(this.gl, vertexShader, fragmentShader);

		let side = 1.0;
		let vertices = new Float32Array([
			-side / 2,
			-side / 2,
			side / 2,
			-side / 2,
			side / 2,
			side / 2,
			-side / 2,
			side / 2
		]);

		let indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

		this._arrayBuffer = new ArrayBuffer(this.gl, vertices);
		this._arrayBuffer.setAttribs('a_position', 2, this.gl.FLOAT, false, 0, 0);

		this._indexBuffer = new IndexArrayBuffer(this.gl, indices);

		this._obj = {
			program: this._program,
			positionBuffer: this._arrayBuffer,
			indexBuffer: this._indexBuffer,
			count: 6
		};
	}

	animateIn() {
		this.isLoop = true;
		TweenLite.ticker.addEventListener('tick', this.loop, this);
	}

	loop() {
		if (this.stats) this.stats.update();
		let gl = this.gl;
		gl.viewport(0, 0, this._width, this._height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this._camera.update();

		this._sphere.render(this._camera);
	}

	animateOut() {
		TweenLite.ticker.removeEventListener('tick', this.loop, this);
	}

	mouseMoveHandler(mouse) {
		if (!this._isMouseDown) return;

		this._prevMouse = mouse;
	}

	mouseDownHandler(mouse) {
		this._isMouseDown = true;
		this._prevMouse = mouse;
	}

	mouseupHandler() {
		this._isMouseDown = false;
	}

	onKeyDown(ev) {
		switch (ev.which) {
			case 27:
				this._playAndStop();
				break;
		}
	}

	_playAndStop() {
		this.isLoop = !this.isLoop;
		if (this.isLoop) {
			TweenLite.ticker.addEventListener('tick', this.loop, this);
			this.playAndStopGui.name('pause');
		} else {
			TweenLite.ticker.removeEventListener('tick', this.loop, this);
			this.playAndStopGui.name('play');
		}
	}

	resize(width, height) {
		this._width = width;
		this._height = height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this.gl.viewport(0, 0, this._width, this._height);
	}

	destroy() {}
}

const dat = require('../vendors/dat.gui.min');
const TweenLite = require('gsap/src/uncompressed/TweenLite');
const Stats = require('stats.js');
const chroma = require('chroma-js');

import { DirectionalLightHelper } from '../../src/DirectionalLightHelper';

import { NormalHelper, GridHelper } from 'tubugl-helper';
import { PerspectiveCamera, CameraController } from 'tubugl-camera';

import { DEPTH_TEST } from 'tubugl-constants';
import { CustomCube, CustomSphere } from './components/CustomShape';
import { vec3 } from 'gl-matrix';

// console.log(CustomCube);

const directionalLightShader = {
	vertexSrc: require('../../src/0-directionalLighting/shader.vert'),
	fragmentSrc: require('../../src/0-directionalLighting/shader.frag')
};

export default class App {
	constructor(params = {}) {
		this._isMouseDown = false;
		this._width = params.width ? params.width : window.innerWidth;
		this._height = params.height ? params.height : window.innerHeight;
		this._isNormalHelper = false;

		this.canvas = document.createElement('canvas');
		this.gl = this.canvas.getContext('webgl');

		this._setClearConfig();
		this._makeCamera();
		this._makeCameraController();
		this._makeSphere();
		this._makeBox();
		this._makeHelper();
		this.resize(this._width, this._height);

		if (params.isDebug) {
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
			this._addGui();
		} else {
			let descId = document.getElementById('tubugl-desc');
			descId.style.display = 'none';
		}
	}

	_addGui() {
		this.gui = new dat.GUI();
		this.playAndStopGui = this.gui.add(this, '_playAndStop').name('pause');
		this.gui.add(this, '_isNormalHelper');
		this._directionalLightHelper.addGui(this.gui);
		let boxFolderGui = this.gui.addFolder('box');
		boxFolderGui
			.addColor(this, '_boxColor')
			.name('color')
			.onChange(() => {
				this._glBoxColor = chroma(this._boxColor).gl();
			});
		let sphereFolderGui = this.gui.addFolder('sphere');
		sphereFolderGui
			.addColor(this, '_sphereColor')
			.name('color')
			.onChange(() => {
				this._glSphereColor = chroma(this._sphereColor).gl();
			});
	}

	_setClearConfig() {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(DEPTH_TEST);
	}

	_makeCamera() {
		this._camera = new PerspectiveCamera(window.innerWidth, window.innerHeight, 60, 1, 2000);
		this._camera.position.z = 800;
		this._camera.position.x = -800;
		this._camera.position.y = 400;
		this._camera.lookAt([0, 0, 0]);
	}

	_makeCameraController() {
		this._cameraController = new CameraController(this._camera, this.canvas);
		this._cameraController.minDistance = 500;
		this._cameraController.maxDistance = 1500;
	}

	_makeSphere() {
		let side = 100;
		this._sphere = new CustomSphere(
			this.gl,
			{
				vertexShaderSrc: directionalLightShader.vertexSrc,
				fragmentShaderSrc: directionalLightShader.fragmentSrc,
				isWire: false
			},
			side,
			15,
			15
		);
		this._sphere.position.y = side;
		this._sphere.position.x = side + 50;
		this._sphereColor = '#ffae23';
		this._glSphereColor = chroma(this._sphereColor).gl();
	}

	_makeBox() {
		let side = 200;

		this._box = new CustomCube(
			this.gl,
			{
				vertexShaderSrc: directionalLightShader.vertexSrc,
				fragmentShaderSrc: directionalLightShader.fragmentSrc,
				isWire: false
			},
			side,
			side,
			side,
			4,
			4,
			4
		);

		this._box.position.y = side / 2;
		this._box.position.x = -side / 2 - 50;
		this._boxColor = '#ffffff';
		this._glBoxColor = chroma(this._boxColor).gl();
	}

	_makeHelper() {
		let gridHelper = new GridHelper(this.gl, {}, 1000, 1000, 20, 20);
		let sphereNormalHelper = new NormalHelper(this.gl, this._sphere);
		let boxNormalHelper = new NormalHelper(this.gl, this._box);
		this._directionalLightHelper = new DirectionalLightHelper(this.gl);

		this._helpers = [gridHelper, this._directionalLightHelper];
		this._normalHelpers = [sphereNormalHelper, boxNormalHelper];
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

		this._box.render(
			this._camera,
			this._directionalLightHelper.lightDirection,
			this._glBoxColor
		);
		this._sphere.render(
			this._camera,
			this._directionalLightHelper.lightDirection,
			this._glSphereColor
		);
		this._helpers.forEach(helper => {
			helper.render(this._camera);
		});

		if (this._isNormalHelper) {
			this._normalHelpers.forEach(normalHelper => {
				normalHelper.render(this._camera);
			});
		}
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

		this._camera.updateSize(this._width, this._height);
	}

	destroy() {}
}

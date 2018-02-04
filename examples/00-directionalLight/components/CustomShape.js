import { Cube } from 'tubugl-3d-shape';
import { Sphere } from 'tubugl-3d-shape/src/sphere';

export class CustomCube extends Cube {
	constructor(
		gl,
		params = { isDepthTest: true },
		width = 100,
		height = 100,
		depth = 100,
		widthSegment = 1,
		heightSegment = 1,
		depthSegment = 1
	) {
		super(gl, params, width, height, depth, widthSegment, heightSegment, depthSegment);
	}

	render(camera, direction, color) {
		this.update(camera, direction, color).draw();
	}

	update(camera, direction, color) {
		super.update(camera);
		this._gl.uniform3f(
			this._program.getUniforms('uReverseLightDirection').location,
			-direction[0],
			-direction[1],
			-direction[2]
		);
		this._gl.uniform3f(
			this._program.getUniforms('uDiffuse').location,
			color[0],
			color[1],
			color[2]
		);
		return this;
	}
}

export class CustomSphere extends Sphere {
	constructor(gl, params = {}, radius = 100, widthSegments = 10, heightSegments = 10) {
		super(gl, params, radius, widthSegments, heightSegments);
	}

	render(camera, direction, color) {
		this.update(camera, direction, color).draw();
	}

	update(camera, direction, color) {
		super.update(camera);
		this._gl.uniform3f(
			this._program.getUniforms('uReverseLightDirection').location,
			-direction[0],
			-direction[1],
			-direction[2]
		);
		this._gl.uniform3f(
			this._program.getUniforms('uDiffuse').location,
			color[0],
			color[1],
			color[2]
		);
		return this;
	}
}

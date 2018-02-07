import { Cube } from 'tubugl-3d-shape';
import { Sphere } from 'tubugl-3d-shape/src/sphere';
import { mat4 } from 'gl-matrix';

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
		this.isAnimation = !!params.isAnimation;
	}

	render(camera, light, color) {
		if (this.isAnimation) this.rotation.y += 0.01;

		this.update(camera, light, color).draw();
	}

	update(camera, light, color) {
		super.update(camera);
		let _mat4 = mat4.create();
		mat4.invert(_mat4, this.modelMatrix);
		mat4.transpose(_mat4, _mat4);

		this._gl.uniform3f(
			this._program.getUniforms('uDiffuse').location,
			color[0],
			color[1],
			color[2]
		);

		this._gl.uniform3f(
			this._program.getUniforms('uLightWorldPosition').location,
			light.position[0],
			light.position[1],
			light.position[2]
		);

		this._gl.uniform1f(this._program.getUniforms('uShininess').location, light.shininess);

		this._gl.uniform3f(this._program.getUniforms('uLightColor').location, 1.0, 0.0, 0.0);

		this._gl.uniform3f(this._program.getUniforms('uSpecularColor').location, 1.0, 1.0, 1.0);

		this._gl.uniformMatrix4fv(this._program.getUniforms('normalMatrix').location, false, _mat4);

		return this;
	}
}

export class CustomSphere extends Sphere {
	constructor(gl, params = {}, radius = 100, widthSegments = 10, heightSegments = 10) {
		super(gl, params, radius, widthSegments, heightSegments);
		this.isAnimation = !!params.isAnimation;
	}

	render(camera, light, color) {
		if (this.isAnimation) this.rotation.y += 0.01;

		this.update(camera, light, color).draw();
	}

	update(camera, light, color) {
		super.update(camera);

		let _mat4 = mat4.create();
		mat4.invert(_mat4, this.modelMatrix);
		mat4.transpose(_mat4, _mat4);

		this._gl.uniform3f(
			this._program.getUniforms('uDiffuse').location,
			color[0],
			color[1],
			color[2]
		);

		this._gl.uniform3f(
			this._program.getUniforms('uLightWorldPosition').location,
			light.position[0],
			light.position[1],
			light.position[2]
		);

		this._gl.uniform1f(this._program.getUniforms('uShininess').location, light.shininess);

		this._gl.uniform3f(this._program.getUniforms('uLightColor').location, 1.0, 0.0, 0.0);

		this._gl.uniform3f(this._program.getUniforms('uSpecularColor').location, 1.0, 1.0, 1.0);

		this._gl.uniformMatrix4fv(this._program.getUniforms('normalMatrix').location, false, _mat4);

		return this;
	}
}

const chroma = require('chroma-js');

import { vec3 } from 'gl-matrix';

export class PointLight {
	constructor(
		xx = 0,
		yy = 0,
		zz = 0,
		shininess = 30,
		lightColor = '#ffffff',
		specualrColor = '#ffffff'
	) {
		this.shininess = shininess;
		this.position = vec3.create();
		vec3.set(this.position, xx, yy, zz);

		this.lightColor = lightColor;
		this.specularColor = specualrColor;
	}

	set lightColor(value) {
		this._lightColor = value;
		this.glLightColor = chroma(this._lightColor).gl();
	}

	get lightColor() {
		return this._lightColor;
	}

	set specularColor(value) {
		this._specularColor = value;
		this.glSpecularColor = chroma(this._specularColor).gl();
	}

	get specularColor() {
		return this._specularColor;
	}
}

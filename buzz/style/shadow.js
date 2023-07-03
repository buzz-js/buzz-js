import { NativeStyleElement } from "./native.js";

class BoxShadow extends NativeStyleElement {
	/**
	 * How high should it be elevated from the screen?
	 * @type {string}
	*/
	elevation;

	/**
	 * What should be the radius of this shadow?
	 * @type {string}
	 */
	radius;

	/**
	 * The color of this shadow.
	 */
	color;

	/**
	 * How far should this be positioned away from the start of the Widget?
	 * @type {string}
	 */
	offset;

	constructor({
		elevation = null,
		radius = null,
		color = null,
		offset = null
	} = {}) {
		this.elevation = elevation;
		this.radius = radius;
		this.color = color;
		this.offset = offset;
	}

	toStylesheet() {
		return this.offset + " " + this.elevation + " " + this.radius + " " + this.color;
	}
}

export {
	BoxShadow
}
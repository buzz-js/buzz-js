import { NativeStyleElement } from "./native.js";

class Border extends NativeStyleElement{
	static LINE_SOLID 	= "solid";
	static LINE_DOTTED 	= "dotted";
	static LINE_DASHED	= "dashed";
	static LINE_DOUBLE	= "double";
	static LINE_GROOVE	= "groove";

	/**
	 * @type {string} CSS-style dimensions
	 */
	lineWidth;

	/**
	 * @type {string} What kind of line is this? Typically, when of the LINE_ static constants.
	 */
	lineType;

	/**
	 * @type {string} A valid color in CSS.
	 */
	color;

	static none = new Border();

	/**
	 * 
	 * @param {string} lineWidth 
	 * @param {string} lineType 
	 * @param {string} color 
	 */
	constructor({
		lineWidth = '0px',
		lineType = Border.LINE_SOLID,
		color = 'transparent'
	} = {}) {
		super();
		this.lineWidth = lineWidth;
		this.lineType = lineType;
		this.color = color;
	}

	/**
	 * 
	 *
	 * @param {string} radius A CSS-style dimension representing the radius to apply on the edges of this stadium border.
	 * Only applies to the left and right like a typical stadium border.
	 * 
	 * @param {string} color A color representing the outline color of this border.
	 *
	 * @returns {Border} A new border with stadium-like geometry: round at both sides and flat at the top and bottom.
	 */
	static stadium() {
		const border = new Border();
		return border;
	}

	toStylesheet() {
		return  this.lineWidth + " " + this.lineType + " " + this.color;
	}
}

export {
	Border
}
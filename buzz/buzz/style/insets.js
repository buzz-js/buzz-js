class InsetsGeometry {
	static zero = InsetsGeometry.all('0');
	
	/**
	 * The offset value from the top of some referenced position on the screen.
	 *
	 * @type {string} A CSS-style dimension
	 */
	top;

	/**
	 * The offset value from the top of some referenced position on the screen.
	 *
	 * @type {string} A CSS-style dimension
	 */
	bottom;

	/**
	 * The offset value left from some referenced position on the screen.
	 *
	 * @type {string} A CSS-style dimension
	 */
	left;

	/**
	 * The offset value from the end of some referenced position on the screen.
	 *
	 * @type {string} A CSS-style dimension
	 */
	right;

	// The internat constructor.
	constructor() {}

	/**
	 * 
	 * @param {string} all The CSS-style dimension used for all the insets here.
	 * 
	 * @returns {InsetsGeometry} A new InsetsGeometry variable where all the values are equal to all.
	 */
	static all(all) {
		const value = new InsetsGeometry();
		value.bottom = all;
		value.left = all;
		value.right = all;
		value.top = all;
		return value;
	}

	static only({
		top = '0',
		left = '0',
		bottom = '0',
		right = '0'
	} = {}) {
		const value = new InsetsGeometry();
		value.bottom = bottom;
		value.left = left;
		value.right = right;
		value.top = top;
		return value;
	}

	static horizontal(both) {
		const value = new InsetsGeometry();
		value.left = both;
		value.right = both;
		return value;
	}

	static vertical(both) {
		const value = new InsetsGeometry();
		value.top = both;
		value.bottom = both;
		return value;
	}
}

class RadialGeometry {
	static empty = this.all("0");

	/**
	 * For a circular border radius
	 * 
	 * @type {string}
	 */
	static GEOMETRY_CIRCULAR = 'circular';

	/**
	 * The amount of curvature to feature at the top left of the
	 * 
	 * @type {string} CSS-style dimension
	 */
	topLeft;

	/**
	 * 
	 * 
	 * @type {string} CSS-style dimension
	 */
	topRight;

	/**
	 * 
	 * 
	 * @type {string} CSS-style dimension
	 */
	bottomLeft;

	/**
	 * 
	 * 
	 * @type {string} CSS-style dimension
	 */
	bottomRight;

	constructor() {}

	/**
	 * 
	 * @param {string} topLeft CSS-style dimension
	 * @param {string} topRight CSS-style dimension
	 * @param {string} bottomLeft CSS-style dimension
	 * @param {string} bottomRight CSS-style dimension
	 * 
	 * @returns {RadialGeometry}
	 */
	static only(topLeft = null, topRight = null, bottomLeft = null, bottomRight = null) {
		const value = new RadialGeometry();

		value.bottomLeft = bottomLeft;
		value.bottomRight = bottomRight;
		value.topLeft = topLeft;
		value.topRight = topRight;

		return value;
	}

	static all(all) {
		const value = new RadialGeometry();
		value.bottomLeft = all;
		value.bottomRight = all;
		value.topLeft = all;
		value.topRight = all;
		return value;
	}
}

export {
	InsetsGeometry,
	RadialGeometry
}
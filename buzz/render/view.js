/**
 * This signifies that a widget is drawn and can be seen and interacted with.
 * @type {number}
 */
const VISIBLE = 1;

/**
 * This signifies that a widget is not drawn on the screen and can not be seen but can still be interacted with.
 * @type {number}
 */
const INVISIBLE = 0;

/**
 * This signifies that a widget is collapsed. It has no height, no width, no interactivity, and no visibility.
 * @type {number}
 */
const GONE = 2;

/**
 * This class represents anything that can be drawn on the screen.
 */
class View {
	/**
	 * The height of this viewport in question.
	 * @type {number}
	 */
	get height() {
		const node = document.getElementById(this.node.id);

		if(node === null) {
			return 0;
		}

		return node.getBoundingClientRect().height;
	}

	/**
	 * The width of the object in question.
	 * @type {number}
	 */
	get width() {
		//console.log(this.node.getBoundingClientRect());
		const node = document.getElementById(this.node.id);

		if(node === null) {
			return 0;
		}

		return node.getBoundingClientRect().width;
	}

	/**
	 * Creates a new View object for using the node of the object as precedent and reference.
	 * 
	 * @param {HTMLElement} node The HTML node representing this viewport.
	 */
	constructor(node) {
		this.node = node;
	}
}

export {
	View,
	VISIBLE,
	INVISIBLE,
	GONE
}
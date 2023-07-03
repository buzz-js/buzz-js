/**
 * This is a class that contains all the possible alignments that any widget with alignment can possibly have. In any Widget that 
 * inherits from Container or SingleChildContainer, this is typically the same thing as specifying the gravity of its contents. 
 *
 * It is worth noting that not all Widget's that inherit from Container can actually align their items inside themselves using 
 * ethically or convenient means. Before you use any Widget that inherits from the Container class, please be sure to check if
 * the Widget in question is labelled as efficient for aligning its contents.
 */
class Alignment {
	/**
	 * Constant for an alignment that means this should be forcibly aligned to the center and bottom of its parent. Vertically, at the
	 * top of its parent but horizontally at the center of its parent.
	 */
	static bottomCenter = new Alignment('bottom-center');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the left and bottom of its parent. Vertically, at the
	 * end of its parent but horizontally at the start of its parent.
	 */
	static bottomLeft 	= new Alignment('bottom-left');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the left and bottom of its parent. Vertically, at the
	 * end of its parent and horizontally at the end of its parent.
	 */
	static bottomRight 	= new Alignment('bottom-right');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the of its parent. Vertically, and horizontally
	 *  central.
	 */
	static center 		= new Alignment('center');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the left and center of its parent. Vertically, central
	 * but horizontally to the left.
	 */
	static centerLeft 	= new Alignment('center-left');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the right and center of its parent. Vertically, central
	 * but horizontally to the right.
	 */
	static centerRight 	= new Alignment('center-right');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the center and top of its parent. Vertically, at the
	 * top of its parent but horizontally at the center of its parent.
	 */
	static topCenter 	= new Alignment('top-center');


	/**
	 * Constant for an alignment that means this should be forcibly aligned to the left and top of its parent. Vertically, at the
	 * top of its parent but horizontally at the start of its parent.
	 */
	static topLeft 		= new Alignment('top-left');

	/**
	 * Constant for an alignment that means this should be forcibly aligned to the center and top of its parent. Vertically, at the
	 * top of its parent but horizontally at the end of its parent.
	 */
	static topRight 	= new Alignment('top-right');

	constructor(value) {
		this.value = value;
	}

	/**
	 * Forces the widget to be drawn in a way such that all the items, irrespective of their sizes, would have the same baseline.
	 * Essentially, they would all sit at the same level.
	 *
	 * @type {function(): Alignment}
	 */
	baseline() {
		const value = new Alignment(this.value);
		value.forced = true;
		return value;
	}
}

export {
	Alignment
}
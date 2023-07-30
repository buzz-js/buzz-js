import { ContainerStyle, SingleChildContainer } from "../framework/container.js";
import { NativeStyleElement } from "../style/native.js";

class RelativeAlignment extends NativeStyleElement{
	static left 	= new RelativeAlignment('start');
	static right 	= new RelativeAlignment('end');
	static center 	= new RelativeAlignment('central');

	constructor(value) {
		this.value = value;
	}

	toStylesheet() {
		return this.value;
	}
}

/**
 * This is a Widget that assists in laying out it's child inside its Flexible parent according to some layout alignment.
 * It only works when the parent of this Align widget is a Flex, Row, Column, Flexible, or any other Widget that is rendered
 * as a flexbox.
 * 
 * It wraps around its child and then aligns itself inside of its flexbox parent using the alignment you have specified.
 */
class Align extends SingleChildContainer {
	/**
	 * To what position should this WIdget be aligned?
	 *
	 * @type {RelativeAlignment}
	 */
	alignment;

	constructor(alignment, {
		child = null,
		style = new ContainerStyle({})
	} = {}) {
		super(child, style);

		// First, bind the alignment
		this.alignment = alignment;

		// If everything went well...
		this.raw = document.createElement("div");
		this.raw.id = this.key;
		this.libraryWidget = true; // Assign the right ID to this Widget.
		
		// Next, create the viewport for this Widget.
		this.viewport = new View(this.raw);
	}

	render(parent) {
		super.render(parent);

		// If this has not been built before which is technically impossible...
		visibilityCheck(this, 'block');

		// Next, apply styling which seems weird because why would you bother doing that to a 
		// widget only meant for alignment?
		this.applyStyle();

		// Next, it is time to wrap around your child.
		this.raw.style.height = 'fit-content';
		this.raw.style.width = 'fit-content';

		// Next, render the child.
		this.renderChild();
		this.mounted = true;

		// Return yourself.
		return this;
	}
}

export {
	Align,
	RelativeAlignment
}
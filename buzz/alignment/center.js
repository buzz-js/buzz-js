import { LeafContainer } from "../framework/container.js";
import { WidgetStyle } from "../style/style.js";
import { Widget } from "../framework/widget.js";


/**
 * This Widget forces its parent to render it at its center. Hence, forcing its child to be rendered at the center as well. 
 * Typically this is implemented in the exact same way as Align(Alignment.center) and they practically do the same things.
 */
class Center extends LeafContainer {
	/**
	 *
	 * @param {Widget} child 
	 * @param {WidgetStyle} style 
	 */
	constructor(child, style) {
		super(child, style);

		// If everything went well...
		this.raw = document.createElement("div");
		this.raw.id = this.key; // Assign the right ID to this Widget.
		
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

		// Next, undo the previous alignments and force this Widget to the center.
		this.raw.style.placeSelf = 'center';

		// Next, it is time to wrap around your child.
		this.raw.style.height = 'fit-content';
		this.raw.style.width = 'fit-content';

		// Next, render the child.
		this.renderChild();
		this.mounted = true;

		// Return this Widget when you are done.
		return this;
	}


}

export {
	Center
}
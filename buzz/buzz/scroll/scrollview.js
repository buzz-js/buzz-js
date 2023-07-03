import { SingleChildContainer, ContainerStyle } from "../framework/container.js"
import { InsetsGeometry } from "../style/insets.js";
import { panic, visibilityCheck } from "../framework/utilities.js";
import { View } from "../render/view.js";
import { Widget } from "../framework/widget.js";

/**
 * This is a widget controller responsible for setting the dynamics relevant to a ScrollableContainer. It controls the axis that the 
 * ScrollableContainer it is associated with is allowed to scroll travel.
 */
class ScrollController {
	/**
	 * 
	 * @param {boolean} vertical Should this controller allow its ScrollableContainer to scroll along the vertical axis?
	 * @param {boolean} horizontal Should this controller allow its ScrollableContainer to scroll along the horizontal axis?
	 */
	constructor(vertical = true, horizontal = false) {
		this.horizontal = horizontal;
		this.vertical = vertical;
	}
}

/**
 * This is a LeafContainer that is used to scroll beyond the boundaries of a Widget that would otherwise truncate or cause an 
 * OverflowError.
 */
class ScrollableContainer extends SingleChildContainer {
	/**
	 * The ScrollController assigned to this particular ScrollableContainer. Think of it as what we would want to use to control
	 * how the ScrollableContainer behaves if a need arises.
	 *
	 * @type {ScrollController}
	 */
	controller;

	/**
	 *  
	 * @param {Widget} child 
	 * @param {ScrollController} controller 
	 * @param {ContainerStyle} style 
	 */
	constructor({
		child = null, 
		controller = new ScrollController(),
		style = new ContainerStyle(),
		padding = InsetsGeometry.zero, 
		margin = InsetsGeometry.zero
	} = {}) {
		super(child, style);

		// If the child is an array or not a type of widget
		if(!child instanceof Widget) {
			panic("Attempted to bind a child to a " + this.constructor.name + " that is not a widget.", this);
		}

		// Moving forward...
		this.controller = controller;

		// Now, we begin to set up the Widget.
		this.padding = padding;
		this.margin = margin;

		// Moving forward, it is time to initialize the view port.
		this.raw = document.createElement("div");
		this.raw.id = this.key; // The ID of this div is in fact the Buzz key of this Widget.
		
		// Next, it is time to get up close and personal.
		this.viewport = new View(this.raw);
	}

	render(parent) {
		super.render(parent);

		// If this has not been built before which is technically impossible...
		visibilityCheck(this, 'block');

		// Next, apply styling to this container.
		this.applyStyle();

		// Now, apply the styling unique to the scroll views just to override anything that might have been set previously.
		if(this.controller.horizontal) {
			this.raw.style.overflowX = "scroll";
		}

		else {
			this.raw.style.overflowX = "hidden";

			// If this is not scrollable across the vertical axis either...
			if(!this.controller.vertical) {
				panic("Attempted to create a " + this.constructor.name + " with neither horizontal nor vertical axis support.", this);
			}
		}

		if(this.controller.vertical) {
			this.raw.style.overflowY = "scroll";
		}

		else {
			this.raw.style.overflowY = "hidden";

			// If this is not scrollable across the vertical axis either...
			if(!this.controller.horizontal) {
				panic("Attempted to create a fix sized widget with neither horizontal nor vertical axis support.", this);
			}
		}

		// After that, render the child.
		this.renderChild(); // After rendering the child, there is no reason not to mount it.
		this.mounted = true;

		return this;
	}

	// This is purely for debugging purposes 
	postRender(context) {
		super.postRender(context);

		// If this is in fact the root view Widget, just return.
		if(this.parent === undefined) {
			return;
		}

		// It is interesting how we need to check something here. We need to check if the Widget that is the parent of this
		// ScrollableWidget has height constraints. If it is not in a bounded box, we cannot, leave it be.
		// However, we can leave it be if its parent it the Widget in the root view.
		if((this.parent.height === undefined || this.parent.width === undefined) && this.parent.parent !== null) {
			panic("Attempted to create a ScrollableContainer inside a Widget that does not have size constraints.", this);
		}
	}
}

export {
	ScrollableContainer,
	ScrollController,
}
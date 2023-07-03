import { SingleChildContainer } from "../framework/container.js";
import { DEBUG_NONE } from "../framework/context.js";

/**
 * 
 */
class Flexible extends SingleChildContainer {
	constructor({
		child = null,
		style = null,
		flexGrow = null,
		flexShrink = null,
		flexBasis = null
	} = {}) {
		super(child, style);

		// How much this guy scales up with respect to the other elements inside the Flex parent
		this.flexGrow = flexGrow;

		// How much this guy shrinks down with respect to all the elements inside the Flex parent.
		this.flexShrink = flexShrink;

		// How much space does everybody take before we begin to redistribute space.
		this.flexBasis = flexBasis;

		// Next it is time to create the HTML Element for this dude.
		this.raw 	= document.createElement("div");
		this.raw.id = this.key;

		// Next, create the viewport.
		this.viewport = new View(this.raw);
	}

	render(parent) {
		super.render(parent);

		// If the parent of this guy does not happen to have a flexible basis
		if(this.parent.raw.style.display !== "flex") {
			if(this.context.debugLevel > DEBUG_NONE) {
				console.error("Found a Flexible widget inside of a container that is not flexible. Was this intentional?");
			}
		}

		// Apply the styling on this guy first.
		this.applyStyle();

		// Remember that the stringified version is
		this.raw.style.flexGrow 	= this.flexGrow;
		this.raw.style.flexShrink	= this.flexShrink;
		this.raw.style.flexBasis	= this.flexBasis;

		// Next, render its child.
		this.renderChild();

		// Finally, mount this guy and that's it.
		this.mounted = true;
		return this;
	}
}

export {
	Flexible
}
import { ContainerStyle, LeafContainer } from '../framework/container.js';
import { panic, visibilityCheck } from '../framework/utilities.js';
import { View } from '../render/view.js';

class ColoredBox extends LeafContainer {
	constructor(color, {
		child = null
	} = {}) {
		super(child, new ContainerStyle({
			backgroundColor: color,
		}));

		if(color === null || color === undefined) {
			panic("Attempt to create a ColoredBox without a specified color.", this);
		}

		// If everything went well...
		this.raw = document.createElement("div");
		this.raw.id = this.key; // Assign the right ID to this Widget.
		
		// Next, create the viewport for this Widget.
		this.viewport = new View(this.raw);
	}

	render(parent) {
		// First, call the super rendering option.
		super.render(parent);

		// If this has not been built before which is technically impossible...
		visibilityCheck(this, 'block');

		// Apply styling to this SizedBox
		this.applyStyle();

		// After that, we attempt to render your child.
		this.renderChild();
		this.mounted = true;

		// Return this SizedBox itself.
		return this;
	}
}

export {
	ColoredBox
}
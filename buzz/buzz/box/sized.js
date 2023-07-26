import { ContainerStyle, SingleChildContainer } from '../framework/container.js';
import { panic, visibilityCheck } from '../framework/utilities.js';
import { View } from '../render/view.js';


/**
 * This is a Widget used to force a Widget to occupy a maximum of <p>height</p>  and <p>width</p>. It is used to control the
 * size of a Widget in cases where spanning indefinitely would be undesired. For instance, a practical use of this Widget is
 * to enforce a region for a ScrollableContainer so the ScrollableContainer would exist only inside those bounds. 
 */
class SizedBox extends SingleChildContainer {
	/**
	 * The height of this sized box. Typically, this is used to control the vertical span of the sized box.
	 *
	 * @type {string} A Valid CSS-style dimension
	 */
	height;

	/**
	 * The width of this sized box. Typically, this is used to control the horizontal span of the sized box.
	 *
	 * @type {string} A Valid CSS-style dimension
	 */
	width;

	/**
	 * 
	 * @param {AppContext} context The context of the app that this widget is being initialized inside of.
	 * @param {string} height The limiting height of this SizedBox. How tall can it be?
	 * @param {string} width The limiting width of this SizedBox. How wide can it grow?
	 * @param {Widget} child The child of this SizedBox. It is basically the widget we want to limit the size of.
	 * @param {ContainerStyle} style The style of this SizedBox. 
	 */
	constructor({
		child = null,
		height = '0',
		width = '0',
		style = null // If no style is available, use the default container style.
	} = {}) {
		// Call the super constructor first
		super(child, style);

		// Check if it has a bounded height
		if(height === 'fit-content') {
			panic("Did not add vertical constraints to a fix sized widget.", this);
		}

		// Check if it has a bounded width
		if(width === 'fit-content') {
			panic("Did not add vertical constraints to a fix sized widget.", this);
		}

		// Assign the width and height constraints.
		this.height = height;
		this.width = width;

		// If everything went well...
		this.raw = document.createElement("div");
		this.raw.id = this.key;
		this.libraryWidget = true; // Assign the right ID to this Widget.
		
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

		// After applying the style, apply the constraints.
		this.raw.style.height = this.height;
		this.raw.style.width = this.width;

		// After that, we attempt to render your child.
		this.renderChild();
		this.mounted = true;

		// Return this SizedBox itself.
		return this;
	}

	// For debugging.
	postRender(context) {
		super.postRender(context);
	}
}

export {
	SizedBox
}
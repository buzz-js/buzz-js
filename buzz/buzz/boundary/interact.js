import { SingleChildContainer } from '../framework/container.js';
import { visibilityCheck } from '../framework/utilities.js';
import { View } from '../render/view.js';

class ActionController extends SingleChildContainer {
	/**
	 * A function called when this ActionController is clicked. The first parameter is control down, second parameter is shift down, 
	 * the third parameter is  alt down, and the last one is meta down.
	 *
	 * @type {function(boolean, boolean, boolean, boolean): void}
	 */
	onClick;

	/**
	 * @param {boolean} hover Are we currently hovering on this Widget?
	 *
	 * @type {function(boolean): void}
	 */
	onHover;

	/**
	 * A function called when this ActionController is clicked twice in succession. The first parameter is control down,
	 *  second parameter is shift down, the third parameter is  alt down, and the last one is meta down.
	 *
	 * @type {function(boolean, boolean, boolean): void}
	 */
	onDoubleClick;

	constructor(child, {
		onClick = null,
		onHover = null,
		onDoubleClick = null,
		enabled = true,
	} = {}) {
		super(child);

		// Bind the values that matter to an interaction controller
		this.onClick = () => {
			console.log("Clicked Action Controller: " + this.key);
			
			if(onClick) 
				onClick();
		}
		this.onDoubleClick = onDoubleClick;
		this.onHover = (hovering) => { 
			if(onHover) 
				onHover(hovering);
		}
		this.clickable = true;
		this.enabled = enabled;

		// Create the HTML viewport for this Widget
		this.raw = document.createElement("div");
		this.raw.classList.add("buzz-button-clickable")
		this.raw.id = this.key; // Assign the right ID to this Widget.

		// Next, create the viewport for this Widget.
		this.viewport = new View(this.raw);
	}

	remove(context) {
		super.unmount(context);

		delete this.onClick;
		delete this.onDoubleClick;
		delete this.onHover;
	}

	render(parent) {
		super.render(parent);

		// This should be flexible so we render the contents directly.
		visibilityCheck(this, 'contents');

		// Now, render its child.
		this.renderChild();
		this.mounted = true; // It has been mounted successfully.

		// Go back and return yourself. You alone are the answer.
		return this;
	}
}

export {
	ActionController
}
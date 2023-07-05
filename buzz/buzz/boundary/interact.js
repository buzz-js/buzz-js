import { SingleChildContainer } from '../framework/container.js';
import { visibilityCheck } from '../framework/utilities.js';

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
		this.onClick = onClick;
		this.onDoubleClick = onDoubleClick;
		this.onHover = onHover;
		this.clickable = true;
		this.enabled = enabled;

		// Create the HTML viewport for this Widget
		this.raw = document.createElement("div");
		this.raw.id = this.key; // Assign the right ID to this Widget.

		// Next, create the viewport for this Widget.
		this.viewport = new View(this.raw);
	}

	remove(context) {
		super.unmount(context);

		// When removing this Widget from the tree...
		if(this.onClick !== null && this.onClick !== undefined) {
			delete this.raw.onclick;
		}

		if(this.onDoubleClick !== null && this.onDoubleClick !== undefined) {
			delete this.raw.ondblclick;
		}

		if(this.onHover !== null && this.onHover !== undefined) {
			// For desktop devices
			delete this.raw.onmouseenter;
			delete this.raw.onmouseleave;

			// Thinking of a mobile implementation soon.
		}
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
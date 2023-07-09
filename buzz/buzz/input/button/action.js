import { SingleChildContainer } from '../../framework/container.js';
import { visibilityCheck } from '../../framework/utilities.js';
import { View } from '../../render/view.js';

const handleMouseDown = function(_this, ev) {
	// Check the moment this started.
	const moment = Date.now();

	// First, add this to the widget.
	_this.raw.setAttribute("buzz-button-down", moment.toString());
}

const handleMouseUp = function(_this, ev) {
	const moment = Date.now(); // As soon as you enter, get the current timestamp.
	const started = Number.parseInt(_this.raw.getAttribute("buzz-button-down"));

	const diff = moment - started;

	if(diff < 1500) { // If this is not long enough to be a long press...
		_this.onClick();
	}

	else {
		_this.onLongClick();
	}

	// Remove the attribute.
	_this.raw.removeAttribute("buzz-button-down"); 
}

const handleDoubleClick = function(_this, ev) {
	_this.onDoubleClick();
}

const handleMouseEnter = function(_this, ev) {
	_this.onHover(true);
	_this.raw.setAttribute("buzz-button-hover", Date.now().toString());
}

const handleMouseLeave = function(_this, ev) {
	_this.onHover(false);
	_this.raw.removeAttribute("buzz-button-hover");
}

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

	/**
	 * Callback made when the user clicks this action controller for over some span of
	 * time.
	 *
	 * @type {function(): void}
	 */
	onLongClick;

	constructor(child, {
		onClick = null,
		onHover = null,
		onDoubleClick = null,
		onLongClick = null,
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
		this.onLongClick = onLongClick;
		this.clickable = true;
		this.enabled = enabled;

		// Create the HTML viewport for this Widget
		this.raw = document.createElement("div");
		this.raw.classList.add("buzz-button-clickable")
		this.raw.id = this.key; // Assign the right ID to this Widget.

		// Next, create the viewport for this Widget.
		this.viewport = new View(this.raw);

		// Bind the listeners
		this.raw.addEventListener("mouseover", (ev) => {
			handleMouseEnter(this, ev);
		});

		this.raw.addEventListener("mouseleave", (ev) => {
			handleMouseLeave(this, ev);
		});

		this.raw.addEventListener("dblclick", (ev) => {
			handleDoubleClick(_this, ev);
		});

		this.raw.addEventListener("mousedown", (ev) => {
			handleMouseDown(this, ev);
		});

		this.raw.addEventListener("mouseup", (ev) => {
			handleMouseUp(this, ev);
		});
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

		// Handle the err... enablement of the button 
		if(this.enabled && (this.onClick || this.onHover || this.onDoubleClick || this.onLongClick)) {
			this.raw.classList.add("enabled");
		}

		else {
			this.raw.classList.remove("enabled");
		}

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
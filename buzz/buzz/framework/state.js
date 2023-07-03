import { panic } from "./utilities.js";
import { Widget } from "./widget.js";

class FrameUpdateEvent extends Event {
	widget;
	key;
	callback;

	constructor(widget, key, callback) {
		super("buzz-frame-update");
		this.widget = widget;
		this.key = key;
		this.callback = callback;
		this.complete = false;
	}
}

class StateController {
	/**
	 * The value corresponding to the number of times a given widget has been updated.
	 * 
	 * @type {number} 
	 */
	current;

	constructor() {
		this.current = 0;
	}

	/**
	 * This method is called to force the state manager associated with this state controller to rebuild this widget.
	 *
	 *  @param {StatefulWidget} widget 
	 * @param {function()} cb The function to be executed directly before the state of the previous state of the widget is invalidated.
	 */
	invalidate(cb) {
		// If this widget has not been built, return an error.
		if(!this.widget.built) {
			panic("Attempted to invalidate the state of a Widget while building it.", widget);
		}

		if(this.widget.controller !== this) {
			panic("Attempted to use a state controller of one widget on another", widget);
		}

		// Increment the number of times this Widget's state has been changed.
		this.current += 1;

		// Send an event to the entire web app so that the app's even handler can known that the web page needs to be rebuilt.
		const updateEvent = new FrameUpdateEvent(this.widget, this.widget.key, cb);
		document.dispatchEvent(updateEvent);
	}
}

class StatefulWidget extends Widget {
	/**
	 * @type {string} The key of this state manager and the widget associated with it.
	 */
	key;

	/**
	 * @type {StateController} 
	 */
	controller;

	/**
	 * Has this widget been built? Typically, only a widget that has been built can change state.
	 * @type {boolean}
	 */
	built;

	/**
	 *
	 * @param {StateController} controller 
	 * @param {function(AppContext): Widget} onStateChanged 
	 */
	constructor(controller) {
		super();

		this.controller = controller;

		// This is false because we need the renderer to be able to accurately determine if this Widget is in fact a fundamental
		// widget or not. Basically, if this is not a fundamental widget, we would need to render it by calling render on the
		// widget that render returns.
		this.built = false;

		// This is the widget that is being rendered.
		controller.widget = this;
	}
}


export {
	StatefulWidget,
	StateController
}
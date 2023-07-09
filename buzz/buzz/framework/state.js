import { DEBUG_LOG, DEBUG_WARNING } from "./context.js";
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

	/**
	 * Switch the state of the StateController so that its reactive StatefulWidget parent
	 * can do what it was required to do on state change. 
	 */
	set state(value) {
		// Only do this if we are going for the reactive method.
		if(!this.reactive && this.widget.context.debugLevel >= DEBUG_WARNING) {
			console.warn("Buzz.js: Attempted to Reactively set state in an Widget that is not Reactive.");
		}

		else {
			this.current += 1;

			// Store the old state inside a temporary variable.
			const old = this.currentState;

			// Update the state.
			this.currentState = value;

			this.widget?.onStateChanged(old, value);
		}
	}

	get state() {
		return this.currentState;
	}

	/**
	 * Creates a new StateController so you can manage the state of any Widget from itself
	 * or any other one.
	 *
	 * @param {any} initial An optional initial state
	 * @param {boolean} reactive Should this state controller 
	 */
	constructor({
		initial = null,
		reactive = false
	} = {}) {
		this.current = 0;
		this.currentState = initial;
		this.reactive = reactive;
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
	 */
	constructor(controller = new StateController()) {
		super();

		// This is false because we need the renderer to be able to accurately determine if this Widget is in fact a fundamental
		// widget or not. Basically, if this is not a fundamental widget, we would need to render it by calling render on the
		// widget that render returns.
		this.built = false;

		// This is the widget that is being rendered.
		if(controller) {
			controller.widget = this;
		}

		// Then we do this.
		this.controller = controller;
	}

	/**
	 * This is a function that is called only when the StateController is created to be
	 * reactive. You see, when this 
	 */
	onStateChanged(previous, current) {
		if(this.context.debugLevel === DEBUG_LOG) {
			console.log(this.key + " reacted on value change from " + previous + ' to ' + current);
		}
	}
}


export {
	StatefulWidget,
	StateController
}
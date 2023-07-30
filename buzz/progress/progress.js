import  { StateController, StatefulWidget } from "../framework/state.js";
import { panic } from "../framework/utilities.js";

/**
 * 
 * @param {ProgressIndicator} indicator
 * @param {number} old
 */
function spinIndicator(indicator) {
	if(indicator.value != indicator.old) {
		if (indicator.value == 100) {
			indicator.controller?.state = -100;
			indicator.old = value;
			indicator.value = -100;
		}

		else {
			indicator.controller?.state += 1;
			indicator.old = value;
			indicator.value += 1;
		}

		return true;
	}

	return false;
}

class ProgressIndicator extends StatefulWidget {
	constructor(controller = new StateController({ initial: 0, reactive:  true})) {
		super(controller);

		if(!controller.reactive) {
			panic(`Attempted to create a ${this.constructor.name} with a StateController that is not reactive. Please make the StateController reactive.`, this);
		}

		if(!(initial instanceof Number)) {
			panic(`Attempted to create a ${this.constructor.name} with a StateController that is not reactive. Please make the StateController reactive.`, this);
		}

		this.value = initial;
		this.endless = false;
	}

	static infinite(controller = new StateController({ initial: 0, reactive:  true})) {
		let indicator = new ProgressIndicator(controller);
		indicator.value += 1; // Make them different so from the get go, the conditional woud fire up.

		// After rendering... kick off the progress timer.
		setInterval(() => spinIndicator(indicator), 500);	

		return indicator;
	}

	unmount(context) {
		super.unmount(context);
	} 

	render(parent) {
		super.render(parent);
	}

	postRender(context) {
		super.postRender(context);
	}

	onStateChanged(previous, current) {
		super.onStateChanged(previous, current);

		// Well, it is detailed enough.
		panic("All Widgets that inherit from ProgressIndicator must implement the onStateChanged method without calling the super.", this);
	}
}

export {
	ProgressIndicator
}
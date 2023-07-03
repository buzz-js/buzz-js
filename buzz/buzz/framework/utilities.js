import { Widget } from './widget.js';
import { VISIBLE } from '../render/view.js';

function time() {
	return new Date().getTime();
}

/**
 * Throws a Buzz.js formatted exception which contains a message and the errors pertaining to the Widget itself.
 *
 *
 * @param {string} error The message that follows this particular exception.
 * @param {Widget} widget The Widget that was the reason for throwing this exception.
 */
function panic(error, widget, addStacktrace = false) {
	var message = error + "\n\nThe Problematic Widget is a " + widget.constructor.name + " with the key #" + widget.key;

	if(addStacktrace) {
		message += "\n\nStacktrace:\n";
	}

	throw (message);
}

/**
 * This helps check if there is a problem with the current visibility value.
 *
 * @param {Widget} widget The widget to check
 * @param {string} preferred The preferred display ype.
 */
function visibilityCheck(widget, preferred) {
	if(!widget instanceof Widget) {
		throw("Expected a widget but got " + this.constructor.name);
	}

	if(widget.style === null || widget.style === undefined) {
		return;
	}

	if(widget.visibility === VISIBLE && (widget.raw.style.display === "none" || widget.style.display === '' || widget.raw.style.display === undefined)) {
		this.raw.style.display = preferred;
	}
}


export {
	time,
	panic,
	visibilityCheck
}

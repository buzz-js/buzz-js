import { GONE, VISIBLE } from "../render/view.js";
import { InsetsGeometry} from "../style/insets.js";
import { AppContext, DEBUG_LOG } from "./context.js";
import { panic } from "./utilities.js";

/**
 * The total number of widgets that have been drawn by the framework.
 * 
 * @type {number}
 */
let count = 0;

class Widget {
	/**
	 * This is the unique identifier of this 
	 * @type {string}
	 */
	key;

	/**
	 * The context this widget is being drawn from. This typically is the context bound to the entire app and is typically 
	 * unchanging.
	 * 
	 * @type {AppContext}
	 */
	get context() {
		return globalThis.buzzContext;
	}

	/**
	 * Has this widget been mounted at all?
	 * 
	 * @type {boolean} 
	 */
	mounted;

	/**
	 * The Widget that houses this one. Well, the widget that is one step above this one in the WidgetTree
	 * 
	 * @type {Widget}
	 */
	parent;

	/**
	 * The raw information about this widget in HTML format.
	 * 
	 * @type {HTMLElement} 
	 */
	raw;

	/**
	 * This is the current state of visibility for this widget.
	 * @type {number}
	 */
	visibility;

	/**
	 * The view port of this widget.
	 * @type {View}
	 */
	viewport;

	/**
	 * The amount of padding inside of this Widget. Think of it as space around the widget before we draw its content.
	 * @type {InsetsGeometry}
	 */
	padding;

	/**
	 * The amount of space around this widget. Think of it as space around this widget before its content is drawn.
	 * @type {InsetsGeometry}
	 */
	margin;


	/**
	 * This callback is made right before a widget is rendered. It is an asynchronous method and is typically used to perform 
	 * actions that need to be finished before the Widget is rendered. For example, getting live updates from a database.
	 *
	 * @param {AppContext} context The context this app is being rendered from.
	*/
	beforeRender(context) {}

	/**
	 * A function called once right after the Widget is rendered to the screen.
	 *
	 * @param {AppContext} context 
	 */
	async postRender(context) {
		if(context.debugLevel === DEBUG_LOG) {
			// If this widget is not the ViewHolder of the entire application
			if(this.key !== "buzz-container") { // Write about it to the user.
				console.log("Buzz.js: initialized the " + this.constructor.name + " with the key #" + this.key + " and its parent is #" + this.parent?.key);
			}
		}
	}

	/**
	 * This constructs a new Widget from the AppContext specified. Note, ALL widgets must in one way or another fully implement this
	 * constructor BEFORE they go on to do their own things.
	 *
	 * @param {AppContext} context
	 */
	constructor() {
		// First, increase the total number of created Widgets by 1.
		count = count + 1;

		// This widget does not have any parents in the initial state of things.
		this.parent = null;

		// When a widget is created, its view state is GONE.
		this.visibility = GONE;

		// This starts out as null.
		this.raw = null;

		// This is a field used only inside of the Framework.
		this.ancestor = null;

		// Finally, generate the ID of this widget.
		this.key = generateID(this);

		// The widget is never mounted at the start.
		this.mounted = false;

		// Finally, add this to the global widget directory.
		globalThis.buzzWidgetDirectory[this.key] = this;
	}

	/**
	 * This function is called when a widget is about to be removed from the RenderTree. The result of this function
	 * determines if all classes that inherit from it should even attempt unmounting.
	 *
	 * @param {AppContext} context The context of the app that is removing this Widget from its RenderTree
	 * 
	 * @returns {boolean} True if this implementation was unmounted successfully and false otherwise. 
	 */
	unmount(context) {
		if(!context instanceof AppContext) {
			throw("Unexpected. We expected an AppContext but found " + context.constructor.name);
		}

		// If we really need the verbose logging schemes
		if(context.debugLevel === DEBUG_LOG) {
			console.log("Unmounted the " + this.constructor.name + " with the identifier " + this.key);
		}

		// Return true. No matter what.
		return true;
	}

	/**
	 * This function is called when a widget is about to be deallocated because it is no longer needed. In Buzz, a Widget would
	 * only be deallocated if its parent is being deallocated or it is being popped away from the navigation history.
	 *
	 * @param {AppContext} context The context of the app that is removing this Widget from its RenderTree.
	 */
	async remove(context) {
		if(!this.context instanceof AppContext) {
			throw("Unexpected. We expected an AppContext but found " + context.constructor.name);
		}

		// Deallocate this Widget's HTML element first.
		delete this.raw;

		// Next, deallocate this Widget's viewport.
		delete this.viewport;

		// Next, deallocate this Widget's margin and padding.
		delete this.margin;
		delete this.padding;

		// If we really need the verbose logging schemes
		if(context.debugLevel === DEBUG_LOG) {
			console.log("Deallocated the " + this.constructor.name + " with the identifier " + this.key);
		}
	}

	/**
	 * This method is called every time a widget needs to be drawn. Calling this method would update the visuals for the method
	 * in realtime. This is why it is advised to heavily trim down the number of times rebuild requests are made hence when you
	 * do not need to use a state manager, do not implement one. This makes everything more performant as everything would start
	 * out as static.
	 * 
	 * 
	 * At this stage, library widgets would technically be built but not displayed. Waiting for them to be mounted inside the HTML
	 * document.
	 *
	 * 
	 * @param {Widget} parent The Widget that this one is laid inside of.
	 * 
	 * @returns {Widget} A widget that represents the contents of this Widget. If this Widget is from the standard library, it would
	 * paint the calling widget and then render itself.
	 */
	render(parent) {
		this.parent = parent;
		this.visibility = VISIBLE;
		this.mounted = false;

		if(this.raw === null || this.raw === undefined) {
			panic("At this point in time, a widget should have been initialized successfully");
		}

		// Finally, call the pre-render function.
		this.beforeRender.call(this, this.context);

		// The default implementation returns the Widget that called it
		return this;
	}
}


/**
 * A widget which does not need to be rebuilt during its lifetime. You are typically advised to use this widget when possible
 * because it has generally lower overhead.
 */
class StatelessWidget extends Widget {
	constructor() {
		super();
	}

	// This is purely for debugging purposes 
	postRender(context) {
		super.postRender(context);
	}
}

/**
 * This is used to generate a valid Buzz UID for any Widget or Drawable element on the screen.
 * This function should not be invoked directly unless you are trying to generate a key for a
 * StateManager. In which case, this is fine.
 */
function generateID(context = null) {
	// We add the timestamp to the number of widgets created at this point in time
	// to create greater variance of the IDs.
	const timestamp = new Date().getTime() + count;
	var key = "buzz-" + context.constructor.name.toLowerCase() + "-" + timestamp.toString(16) + "-" + Math.floor(Math.random()*100000000).toString(16);
	return key;
}


export {
	Widget,
	StatelessWidget,
	count as totalWidgetCount
}
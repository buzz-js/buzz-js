import { RenderObject } from './render/renderer.js';
import { Widget } from './framework/widget.js';
import { View } from './render/view.js';
import { AppContext } from './framework/context.js';
import { AppTheme, ButtonTheme, EditTextTheme, TextTheme } from "./style/theme.js";
import { StatefulWidget } from './framework/state.js';
import { Route, Router } from './navigator/router.js';
import { NavigationAnchor, NavigationController } from './navigator/anchor.js';

class BuzzApp {
	/**
	 * The location this app starts from. Typically, should be a route that your app's router recognizes as valid and can detect.
	 * Traditionally, this should start with a forward slash '/' just to look more like a browser path.
	 *
	 * @type {string}
	 */
	defaultRoute;

	/**
	 * The router of the app. Typically what the framework uses the 
	 *
	 * @type {Router}
	 */
	router;

	/**
	 * The context this app is running inside of.
	 * 
	 * @type {AppContext}
	 */
	get context() {
		return globalThis.buzzContext;
	}

	/**
	 * The viewport that all of the contents of this app would be rendered inside of. It is basically the body of the only child inside
	 * the body tag in the index file. 
	 * 
	 * @type {View}
	 */
	viewport;

	/**
	 * The theme of this Buzz App.
	 * 
	 * @type {AppTheme}
	 */
	theme;

	/**
	 *
	 * @param {Widget} defaultRoute
	 * @param {boolean} debug
	 */
	constructor({
		defaultRoute = null,
		debugLevel = 0,
		router = null,
		theme = null
	} = {}) {
		// First, we initialize the app's context.
		AppContext.initialize(
			RenderObject.instance, 
		
			// Now craft your application's theme.
			theme ?? new AppTheme(
				'black', {
				primaryColor: 'black',
				secondaryColor: 'black',
				accentColor: 'yellow',
				backgroundColor: 'white',
				textTheme: new TextTheme(),
				editTextTheme: new EditTextTheme(),
				buttonTheme: new ButtonTheme()
			})
		);

		// Next we initialize everything else.
		this.viewport = new View(document.getElementById("buzz-container"));
		this.debugLevel = debugLevel;
		this.defaultRoute = defaultRoute;
		this.router = router;

		// Set the debug level of this context.
		this.context.debugLevel = debugLevel;

		// Initialize the buzzApp globally.
		globalThis.buzzApp = this; // Just keeping this in check so we know it.

		// Initialize the system navigator globally.
		const buzzAppNavigationAnchor = new NavigationAnchor(new NavigationController(), true);

		// Remove the previous key from the global navigation controller's registry
		globalThis.buzzNavigationControllers[buzzAppNavigationAnchor.key] = undefined;

		// Delete the previous navigation anchor's HTML viewport.
		delete buzzAppNavigationAnchor.raw;

		// Map the System's navigation anchor to the root viewport.
		buzzAppNavigationAnchor.raw 	= document.getElementById("buzz-container");
		buzzAppNavigationAnchor.raw.id 	= "buzz-container"; // Assign the ID.
		buzzAppNavigationAnchor.key 	= "buzz-container";

		// Keep the UID inside the controller too
		buzzAppNavigationAnchor.controller.stack.uid = "buzz-container";

		// Next, bind this to the global scope
		globalThis.buzzAppNavigationAnchor = buzzAppNavigationAnchor;

		// Moving forward, switch the router logic up.
		window.onpopstate = (event) => {
			// Fetch the full path of the next screen position to go to.
			const path = window.location.pathname;

			// Move backwards to this route
			const route = this.router.onRouteDispatched(new Route(path, null));

			// Next, we test just how practical this really gets.
			console.log("Event: " + event);
			console.log("Route: " + route);
		};
	}
}

/**
 * 
 * @param {BuzzApp} app 
 */
function run(app) {
	// First, perform a type security check.
	if(app === null || !(app instanceof BuzzApp)) { // If this is not an app instance, cease operation because something has gone wrong.
		throw("Unable to startup the Buzz app because the created app is not a BuzzApp but a " + app.constructor.name);
	}

	// First, let us paint the background of the app.
	const body = document.getElementsByTagName("body")[0];
	body.style.backgroundColor = app.context.theme.backgroundColor;

	// Next, we would want to use the router of this app to generate the initial route.
	const defaultPage = app.router.onRouteDispatched(new Route(app.defaultRoute, null)).page;

	// Now, initialize the root view of this app.
	defaultPage.key = "buzz-container";
	defaultPage.raw = document.getElementById("buzz-container");

	// Next, the root view of any WebApp should always fill the screen.
	defaultPage.raw.style.height = '100vh';
	defaultPage.raw.style.width = '100vw';
	defaultPage.raw.style.display = "block";
	defaultPage.raw.style.overflow = 'hidden';

	// This is the viewport of the default page.
	defaultPage.viewport = app.viewport;

	// Now, it is time to render the contents of the page.
	let widget = defaultPage.render(null);
	widget = widget.render(defaultPage);

	// Now, the root widget is mounted successfully.
	defaultPage.raw.innerHTML = widget.raw.outerHTML;
	widget.mounted = true;

	// defaultPage.raw.appendChild(widget.raw);

	if(widget instanceof StatefulWidget) {
		widget.built = true;
	}

	// Finally, the size of the root widget in this view should be the same as the size of the parent widget
	// Just because, what else would it be?
	widget.raw.style.height = 'inherit';
	widget.raw.style.width = 'inherit';

	// Now, it is time to call the postRender function of the Widget that page renders.
	widget.postRender(app.context);

	// This has been mounted in the HTML Render Tree.
	defaultPage.mounted = true;

	// After this widget has been rendered, we change the value of the built state.
	if(defaultPage instanceof StatefulWidget) {
		defaultPage.built = true;
	}

	// Last, it is time to call the function we execute right after the widget is rendered.
	defaultPage.postRender(app.context);
}

document.addEventListener("click", function (event) {
	/** @type {Element} The key of the element that is being clicked. */
	var key = event.target.id;

	// Time to retrieve the element from the registry.
	var widget = globalThis.buzzWidgetDirectory[key];

	if(!widget) {
		return;
	}

	while(!widget.clickable) {
		widget = widget.parent;
		key = widget.key;
	}

	if(widget.enabled) {
		widget.onClick();
	}
});

document.addEventListener("auxclick", function (event) {
	/** @type {Element} The key of the element that is being clicked. */
	const key = event.target.id;

	// Time to retrieve the element from the registry.
	const widget = globalThis.buzzWidgetDirectory[key];

	if(!widget || !widget.clickable) {
		return; // Don't bother if this widget is not clickable from Buzz Context.
	}

	// Call the double click event.
	if(widget.enabled) {
		widget.onDoubleClick?.call();
	}
});

document.addEventListener("mouseover", function (event) {
	/** @type {Element} The key of the element that is being clicked. */
	const key = event.target.id;

	// Time to retrieve the element from the registry.
	const widget = globalThis.buzzWidgetDirectory[key];

	if(!widget || !widget.clickable) {
		return; // Don't bother if this widget is not clickable from Buzz Context.
	}

	if(widget instanceof Widget && widget.enabled) {
		widget.onHover(true);
	}
});

document.addEventListener("mouseout", function(event) {
	/** @type {Element} The key of the element that is being clicked. */
	const key = event.target.id;

	// Time to retrieve the element from the registry.
	const widget = globalThis.buzzWidgetDirectory[key];

	if(!widget || !widget.clickable) {
		return; // Don't bother if this widget is not clickable from Buzz Context.
	}

	if(widget instanceof Widget && widget.enabled) {
		widget.onHover(false);
	}
});

// Next, we add the even dispatch listener for UI layer updates.
document.addEventListener("buzz-frame-update", function (event) {
	/** @type {StatefulWidget} */
	const cached = event.widget;
	/** @type {string} */
	const key = event.key;
	/** @type {function()} */
	const callback = event.callback;

	// If the Widget whose state you wish to update is not a member of the Widget subclass,
	if(!cached instanceof StatefulWidget) {
		throw("Attempted to render an updated state for an object that is not a StatefulWidget.\n\nExpected StatefulWidget found " + cached.constructor.name);
	}

	// First, we say the widget is currently being built.
	cached.built = false;

	// If we made it this far, then that widget is  in fact a StatefulWidget
	callback.call(); // Next, invoke the callback to balance of the state of the coming widget.

	/**
	 * Render the true contents of this widget again and store it here.
	 * @type {Widget}
	 */
	let rendered = cached.render(cached.parent);

	// If these two are not the same Widget fundamentally...
	if(rendered.key !== cached.key) {
		rendered.parent = cached; // Then the parent of the Widget we just rendered is the widget we cached.
	}

	let ancestor = rendered.parent;
	
	// Now, walk backwards to find the true ancestor.
	while(!ancestor.mounted) {
		if(ancestor.parent !== null) {
			ancestor = ancestor.parent;
		}

		// If this has no ancestor, meaning it is the topmost viewport.
		else {
			break;
		}
	}

	// We've tried finding the first Widget that can be rendered this many times right now. 
	let times = 0;

	// If this is not a fundamental widget... 
	while(!rendered.mounted) { // Render the body once more
		// Call the post render function up here to avoid repeating it unnecessarily so if the Widget we just built was successfully
		// mounted, it wouldn't affect the general state of things.
		rendered.postRender(rendered.context); // First, call the post render function for this Widget.

		// Increase the number of times ths has been rendered once.
		times++;

		// If this has been rendered more than once already, then we need to detach it from the rendered Widget.
		let parent = times > 1 ? rendered : rendered.parent;

		// Render once more to see if there is any more Widgets that can be rendered.
		rendered = rendered.render(parent);

		// If this failed for whatever reason
		if(!rendered) {
			throw("Attempted to rendering an undefined widget. Cannot pass null or undefined as the result for render.");
		}

		// If what was just rendered is a StatefulWidget...
		if(rendered instanceof StatefulWidget) {
			rendered.built = true; // Tell this Widget we have built it.
		}
	}

	// Finally, bind the ancestor of this widget to keep the implementation consistent.
	rendered.ancestor = ancestor;

	// Next, locate the HTML node that is represented by the Widget in question.
	const widget = document.getElementById(key);

	if(!widget) {
		throw("Unable to locate any widget with the ID " + key + " therefore it was impossible to update. This might have happened because this Widget has been detached from the render tree. Before you call invalidate, you are advised to make sure the StatefulWidget you are invalidating is still mounted.");
	}

	// Update the contents of the HTML inside here to the one outside here.
	if(cached.key === rendered.key) { // If this is the same widget.
		// Perform an update only on the state of yourself.
		widget.outerHTML = rendered.raw.outerHTML;
	}

	else {
		// Perform an update on the state of your contents.
		widget.innerHTML = rendered.raw.outerHTML;
	}

	// Finally, notify the framework that this Widget has been built and mounted.
	cached.built = true;
	cached.mounted = true;

	// Finally, we call the post renderMethod because it really does need to be called.
	rendered.postRender(cached.context); // Now call the rendered Widget's postRender function.

	// After that, we call the cached widget's postRendered function
	cached.postRender(cached.context);
});

export {
	BuzzApp,
	run
}
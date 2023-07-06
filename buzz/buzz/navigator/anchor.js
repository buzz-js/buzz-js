import { StatefulWidget } from '../framework/state.js';
import { panic, visibilityCheck } from '../framework/utilities.js';
import { StatelessWidget, Widget } from '../framework/widget.js';
import { View } from '../render/view.js';
import { Route, Router } from './router.js';

class NavigationHistory {
	/**
	 * The final destination of this route. Should be a Widget that denotes a page at some level logical to any navigator
	 * inside your webapp.
	 *
	 * @type {Widget}
	 */
	page;

	/**
	 * The logical path that leads to this route.
	 *
	 * @type {string}
	 */
	path;


	constructor(page, path) {
		this.page = page;
		this.path = path;
	}
}

class NavigationStack {
	/**
	 * The key of the navigator that this is bound to.
	 *
	 * @type {string}
	 */
	uid;

	/**
	 * The widget the associated
	 */
	page;

	/**
	* @type {number} 
	*/
	index;

	/**
	 * @type {NavigationHistory[]}
	 */
	data;
}

/**
 * This is used to control the current context of an app's flow of execution. At the framework level, it switches between the active
 * pages inside an app. 
 * 
 * However, at the implementation level, it should be used typically only to change the active view inside a given NavigatingWidget.
 */
class NavigationController {
	constructor() {
		// Create the navigation stack.
		this.stack = new NavigationStack();
	}

	/**
	 * This function is used to push a Widget directly to navigation history. Would keep this View at the top of the current navigation
	 * stack and would keep it in the viewable window. 
	 *
	 * @param {Widget} widget The widget to push to the top of the navigation stack.
	*/
	push(widget, path=undefined) {
		// First, we check if this is valid.
		if(!widget instanceof Widget) {
			throw("Expected to find a Widget but found a " + widget.constructor.name);
		}

		/** 
		 * Next, we can retrieve the calling widget from the widget directory.
		 * @type {NavigationAnchor} 
		*/
		const anchor = globalThis.buzzWidgetDirectory[this.stack.uid];

		// If the widget we found is not a NavigationAnchor but somehow you expect us to implement it...
		if(!anchor instanceof NavigationAnchor) {
			panic("Attempted to use a NavigationController to change the contents of a Widget that is not a NavigationAnchor.", anchor);
		}

		// Switch the active view to the view denoted by the widget we have as a parameter.
		anchor.raw.appendChild(widget.raw);

		// Get the current widget and unmount it.
		const current = this.stack.data[this.stack.index];
		current.mounted = !current.unmount(current.context); // Try unmounting this widget.

		// If this widget is still mounted.
		if(current.mounted) {
			panic("Unable to properly unmount a widget from the RenderTree.", current);
		}

		// Get this out of the way.
		if(current instanceof StatefulWidget) {
			current.built = current.mounted;
		}

		// Finally, we push this onto the stack.
		this.stack.data[this.stack.index++] = new NavigationHistory(widget, path);

		// If however... this navigator has the permission to change the history of the page.
		if(anchor.changeHistory) {
			globalThis.history.pushState(widget, "", widget.key, path === undefined ? "#" + widget.key : path);
		}
	}

	/**
	 * Moves navigation backward by one Widget.
	 * 
	 * @throws An error if there is no Widget before the caller in the navigation stack.
	 */
	async pop() {
		if(index  < 1) {
			index = 1;
			throw("Attempted to pop the root window of a Buzz web app. If you called popUntil(path), this means that we could not find the route you specified, check your spelling or if you forgot to add the leading slash.");
		}

		// First, we get the anchor.
		/**
		 * @type {NavigationAnchor} 
		 */
		const anchor = globalThis.buzzWidgetDirectory[this.stack.uid];

		// If the widget we found is not a NavigationAnchor but somehow you expect us to implement it...
		if(!anchor instanceof NavigationAnchor) {
			panic("Attempted to use a NavigationController to change the contents of a Widget that is not a NavigationAnchor.", anchor);
		}

		// Get the child that this widget is currently drawing.
		const current = this.stack.data[this.stack.index].page;

		// Retrieve the previous Widget sha.
		const previous = this.stack.data[this.stack.index - 1].page;

		// Next, we mount the previous widget on this anchor.
		anchor.raw.appendChild(previous.raw);
		anchor.mounted = true;

		// If the previous widget was a stateful Widget,
		if(previous instanceof StatefulWidget) {
			previous.built = true;
		}


		// Next, unmount the widget that was mounted to the RenderTree.
		current.mounted = !current.unmount(current.context); // Try unmounting this widget.

		// If this widget is still mounted.
		if(current.mounted) {
			panic("Unable to properly unmount a widget from the RenderTree.", current);
		}

		// Get this out of the way.
		if(current instanceof StatefulWidget) {
			current.built = current.mounted;
		}

		// Remove this object from the entire window.
		await current.remove(current.context);

		// After the removing the object, it is time to delete this.
		delete globalThis.buzzWidgetDirectory[this.key];

		// After doing that, we check if this Widget can change history. If it can... that's great.
		if(anchor.changeHistory) {
			globalThis.history.back();
		}

		// If all of that was successful...
		this.stack.index -= 1; // Decrease the index of the browser stack by 1.
	}

	/**
	 * Replaces the widget on top of the navigation history directly. This would make it such that calling any implementation of pop()
	 * would not actually move to the widget that was replaced but what was before it. This should be used when there is a logical 
	 * transition of the execution context inside a web app. 
	 * 
	 * For instance, if you have switched from the login phase to the dashboard. Logically speaking, it would be undesired to for 
	 * the user to be able to navigate back to the login page. Since, that much does not technically make sense. 
	 *
	 * @param {Widget} widget The widget to use as a replacement for the one in current view for this navigator.
	 */
	async replace(widget, path=undefined) {
		if(!widget instanceof Widget) {
			throw("Expected to find a Widget but found a " + widget.constructor.name);
		}

		// If this has not been mounted or built, meaning it is just the body of something else.
		while(!widget.mounted) {
			// Render something forward again using the previous hook as the parent.
			widget = widget.render(widget);

			// Stop if at some point things just begin to get weird.
			if(widget === null || widget === undefined) {
				break;
			}

			// If this is a StatefulWidget
			if(widget instanceof StatefulWidget) {
				widget.built = true; // Let it know it has been built.
			}

			// Call the Widget's post render method.
			widget.postRender(widget.context);
		}

		// First, we get the anchor.
		/**
		 * @type {NavigationAnchor} 
		 */
		const anchor = globalThis.buzzWidgetDirectory[this.stack.uid];

		// If the widget we found is not a NavigationAnchor but somehow you expect us to implement it...
		if(!anchor instanceof NavigationAnchor) {
			panic("Attempted to use a NavigationController to change the contents of a Widget that is not a NavigationAnchor.", anchor);
		}

		// Get the child that this widget is currently drawing.
		const current = this.stack.data[this.stack.index].page;

		// First, mount the next widget.
		anchor.raw.appendChild(widget.raw);
		anchor.mounted = true;

		// If the Widget we were just about to mount is a Stateful Widget.
		if(widget instanceof StatefulWidget) {
			widget.built = true; // Tell the Widget we now know it has been built.
		}

		// At this point in time, it would be best to unmount the old widget.
		current.mounted = !current.unmount(widget.context);

		// If this widget is still mounted.
		if(current.mounted) {
			// We can't run along knowing this Widget was not successfully unmounted.
			panic("Unable to properly unmount a widget from the RenderTree.", current);
		}

		// If we however did unmount this Widget successfully, then it would be time to deallocate it as well.
		await current.remove(widget.context);

		// When the widget is removed successfully... It is time to delete the Widget from our entire SPA.
		delete globalThis.buzzWidgetDirectory[current.key];

		// Finally, if this Navigation Controller is allowed to affect browser history...
		if(anchor.changeHistory) {
			globalThis.history.replaceState(widget, "", path === undefined ? "#" + widget.key : path);
		}

		// Finally, it is time to replace the state of this Widget in our own view stack....
		this.stack.data[this.stack.index] = new NavigationHistory(widget, path);
	}

	/**
	 * Performs the same action as the replace(Widget) method. However, this does not explicity take in a Widget for its parameter.
	 * It creates the Widget from its route name using the Router of the entire app.
	 *
	 * @param {string} path 
	 */
	async replaceNamed(path, {extra=null}) {
		// First, we build the  route.
		const route = new Route(path, extra);

		// Next fetch the currently running app just for the sanity of type-checking
		const app = globalThis.buzzApp;

		/** @type {Router} */
		const router = app.router;  // Next, get the app's router
		const transaction = router.onRouteDispatched(route); // After this, initiate the transaction.

		// If this route was not located...
		if(transaction === null || transaction === undefined) {
			if(!router.onRouteMissed(route)) { // Invoke the router's on miss function.
				throw("Unable to resolve the route \"" + route.path + "\". Please check your spelling, it might be what is incorrect.");
			}
		}

		// After that, we retrieve the Widget involved in the transaction.
		await this.replace(transaction.page, path);
	}

	/**
	 * 
	 * @param {string} path The name of the route we need to get to before we stop 
	 */
	pushNamed(path, {extra=null}) {
		// First, we build the  route.
		const route = new Route(path, extra);

		// Next fetch the currently running app just for the sanity of type-checking
		const app = globalThis.buzzApp;

		/** @type {Router} */
		const router = app.router;  // Next, get the app's router
		const transaction = router.onRouteDispatched(route); // After this, initiate the transaction.

		// If this route was not located...
		if(transaction === null || transaction === undefined) {
			if(!router.onRouteMissed(route)) { // Invoke the router's on miss function.
				throw("Unable to resolve the route \"" + route.path + "\". Please check your spelling, it might be what is incorrect.");
			}
		}

		// After that, we retrieve the Widget involved in the transaction.
		this.push(transaction.page, path);
	}

	/**
	 * 
	 * @param {string} path The name of the route where we need to get to before we stop removing views.
	 */
	async popUntil(path) {
		for(let current = this.stack.data[this.stack.index]; current.path !== path; current = this.stack.data[this.stack.index]) {
			await this.pop();
		}
	}
}

/**
 * This class is a Widget that is used to switch between active views inside a widget. It is used to change what the user is
 * currently seeing from the context of a Widget. At the framework level, it is what is used to manage the navigation history of 
 * the entire webapp. However, at the implementation level, it is used to manage the container inside of a Buzz App.
 *
 *
 * Furthermore, applied usage can also be found in the creation of custom navigation widgets like Dashboard, NavigationBar, Drawer
 * BottomNavigationBar, and so on. When changing the active view in any of those pages, it is this Widget itself that is used to 
 * hold the contents.
 */
class NavigationAnchor extends StatelessWidget {
	/**
	 * Does changing the contents of this NavigationAnchor mean that the navigation stack of the WebApp must be changed?
	 * 
	 * @type {boolean}
	 */
	changeHistory;

	/**
	 * The navigation controller bound to this NavigationAnchor. It would help manage the widget currently inside the viewing
	 * area of this NavigationAnchor.
	 *
	 * @type {NavigationController}
	 */
	controller;

	constructor(controller = new NavigationController(), changeHistory = false) {
		super();
		this.controller = controller;
		this.changeHistory = changeHistory;

		// Next, add the controller of this widget to the global navigation controllers' directory so
		// we can manage its contents using a NavigationController.
		globalThis.buzzNavigationControllers[this.key] = controller;

		// Bind the controller to this navigation anchor.
		controller.stack.uid = this.key;

		// If everything went well...
		this.raw = document.createElement("div");
		this.raw.id = this.key; // Assign the right ID to this Widget.
		
		// Next, create the viewport for this Widget.
		this.viewport = new View(this.raw);
	}

	render(parent) {
		super.render(parent);

		// Just render the contents.
		visibilityCheck(this, 'contents');

		// We do it like this.
		this.raw.style.display = 'contents';

		// We have finished rendering this widget so you can stop recursively spawning now.
		this.mounted = true;

		// Return the reference to this widget itself
		return this;
	}

	beforeRender(context) {
		super.beforeRender(context);
	}

	postRender(context) {
		super.postRender(context);

		// After creating a 	
	}
}

export {
	NavigationAnchor,
	NavigationController
}

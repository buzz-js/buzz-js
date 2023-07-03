import { DEBUG_WARNING } from '../framework/context.js';
import {Widget} from '../framework/widget.js';


class Route {
	/**
	 * The path that this route represents. Typically, should be handled by your app one way or another. 
	 * 
	 * @type {string}
	 */
	path;

	/**
	 * The extra information that you wish to send with this route when it is created. Typically used to pass information from the
	 * predecessor necessary to draw a widget.
	 */
	extra;

	constructor(path, extra) {
		this.path = path;
		this.extra = extra;

		// If the route name does not start with a leading slash...
		if(!this.path.startsWith('/', 0)) {
			if(globalThis.buzzContext.debugLevel >= DEBUG_WARNING) {
				console.warn("Found a route path that does not start with a leading slash ('/'). Found " + this.path.charAt(0));
			}
		}
	}
}

class RouteTransaction {
	/**
	 * The transition animation to use when moving to this next page.
	 *
	 * @type {Animation}
	 */
	transition;

	/**
	 * The final destination of this route. Should be a Widget that denotes a page at some level logical to any navigator
	 * inside your webapp.
	 *
	 * @type {Widget}
	 */
	page;


	constructor({
		transition = globalThis.buzzContext.navigationTransition,
		page = null
	} = {}) {
		this.transition = transition;
		this.page = page;
	}
}

class Router {
	/**
	 * A function called when the route indicated by a given path does not correspond to any of the routes in our 
	 * Router.onRouteDispatched(Route) function. This function is never called unless onRouteDispatched returns null.
	 *
	 * @type {function(Route): boolean}
	 * @returns {boolean} Should return true if the problem was resolved successfully.
	 */
	onRouteMissed;

	/**
	 * A function called when a NavigationController dispatches a named route. Typically, this is called whenever a 
	 * NavigationController calls pushNamed, or replaceNamed.
	 * 
	 * @type {function(Route): RouteTransaction}
	 * @returns {RouteTransaction}
	 */
	onRouteDispatched;


	constructor({
		onRouteMissed = function(route) {
			return false;
		},
		onRouteDispatched = function(route) {
			return null;
		}
	} = {}) {
		this.onRouteMissed = onRouteMissed;
		this.onRouteDispatched = onRouteDispatched;
	}
}

export {
	Router,
	Route,
	RouteTransaction
}
import { AppContext } from "../framework/context.js";
import { BuzzStyleAttribute } from "../style/native.js";
import { NavigationController } from "./anchor.js";


class RedirectTarget {
	/**
	 * This means to redirect to a Window entirely.
	 *
	 * @type {string}
	 */
	static newInstance = "";

	static currentInstance = "";

	constructor() {
		throw("Attempted to create an instance of a static class in Buzz");
	}
}

class SystemNavigator extends BuzzStyleAttribute {
	/**
	 * Retrieves the topmost NavigationController in the app's runtime context. The navigation controller that this returns is
	 * the one that is used to transition between PageViews. Essentially, entire Windows. This is only useful when the Buzz App 
	 * designed here is typically designed with multiple functionalities in mind and would need logically numerous different 
	 * pages.
	 * 
	 * For instance, if you choose to use Buzz.js to make an entire website and then a web app too. For instance, a login button
	 * could redirect the user to an entirely different PageView which would manage the user dashboard. When the user gets to that
	 * PageView, if there is no user logged in, we show a login PageView and if a user is logged in, we show a DashboardPageView.
	 *
	 * @param {AppContext} context The context of the application that is currently running.
	 * @type {function(AppContext): NavigationController}
	 */
	static of(context) {
		if(!context instanceof AppContext) {
			throw("Expected to find AppContext but found " + context.constructor.name);
		}

		if(context !== null && context !== undefined) {
			throw("Invalid context. Context cannot be null or undefined");
		}

		// Return the navigation anchor of this guy.
		return globalThis.buzzAppNavigationAnchor.controller;
	}

	/**
	 * This is used to move to an entirely different website from this BuzzApp. It takes the context of the browser away from this 
	 * webapp and to a new web domain entirely.
	 *
	 * @param {string|URL} url The URL of the webpage you wish to transition to.
	 * @param {boolean} keepHistory Should we allow it to be possible to transition back to this webapp?
	 */
	static redirectTo(url, keepHistory = true) {
		if(keepHistory) {
			window.location.href = url;
		}

		else {
			window.location.replace(url);
		}
	}
}

export {
	SystemNavigator,
	RedirectTarget
}
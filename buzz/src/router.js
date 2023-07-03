import { Router, RouteTransaction } from '../buzz/navigator/router.js';
import { HomePage } from './home.js';

/*
 * The advised way to use routing implementations.
 */
export default new Router({
	onRouteMissed: (route) => {
		throw("Unable to locate the route identified by " + route.path);
	},

	onRouteDispatched: (route) => {
		switch(route.path) {
			case "/": {
				return new RouteTransaction({
					page:  new HomePage()
				});
			}
		}

		return null;
	}
});
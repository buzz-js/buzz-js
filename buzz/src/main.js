import { BuzzApp, run } from "../buzz/app.js";
import { DEBUG_LOG, DEBUG_NONE } from "../buzz/framework/context.js";
import myAppRouter from "./router.js";

// Create the context of this web app.
class MyApp extends BuzzApp {
	constructor() {
		super({
			defaultRoute: '/',
			debugLevel: DEBUG_NONE,
			router: myAppRouter
		});
	}
}

// After everything, run the app.
run(new MyApp());
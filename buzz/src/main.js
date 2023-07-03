import { BuzzApp, run } from "../buzz/app.js";
import { DEBUG_LOG } from "../buzz/framework/context.js";
import myAppRouter from "./router.js";

// Create the context of this web app.
class MyApp extends BuzzApp {
	constructor() {
		super({
			defaultRoute: '/',
			debugLevel: DEBUG_LOG,
			router: myAppRouter
		});
	}
}

// After everything, run the app.
run(new MyApp());
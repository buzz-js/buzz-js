import { panic } from "../framework/utilities.js";
import { StatelessWidget, Widget } from "../framework/widget.js";
import { Drawer } from "./drawer/base.js";

class PageView extends StatelessWidget {
	/**
	 * This is the header of the page and is typically the heading navigation bar.
	 * 
	 * @type {Widget}
	 */
	header;

	/**
	 * This is the footer of the page and is typically the one at the bottom of the page.
	 * 
	 * @type {Widget}
	 */
	footer;

	/**
	 * This is the navigation drawer of the page and is typically at the side of the page.
	 * 
	 * @type {Drawer}
	 */
	drawer;

	/**
	 * This is the body of the page and is typically where  the real content goes.
	 * 
	 * @type {Widget}
	 */
	body;

	constructor({
		body = undefined,
		drawer = undefined,
		header = undefined,
		footer = undefined,
	} = {}) {
		super();
		this.header = header;
		this.footer = footer;
		this.drawer = drawer;
		this.body = body;

		// This is a library Widget. 
		this.libraryWidget = true;

		// Now, create the container for the content of the page.
		this.content = document.createElement("div");
		this.content.id = this.key + "-content";
	
		// Now, it is time to bind the body to the buzz container.
		this.raw = document.createElement("div");
		this.raw.id = this.key;

		// If the body of this widget is undefined...
		if(!body) {
			throw new Exception("Attempted to create a " + this.constructor.name + " widget instance without binding a body.");
		}
	}


	render(parent) {
		super.render(parent);

		// First, the body should be a flex box.
		this.raw.style.display = "flex";
		this.raw.style.flexDirection = "column";

		// Next, add the body to the widget.
		if(this.header) {
			// Oh-kay, this is nice to know.
			let header = this.header.render();

			// Just wait here till we are mounted, duh.
			while (!header.mounted) {
				header = header.render();
			}

			// Then we can append the header afterwards.
			this.raw.appendChild(header.raw);
		}

		this.content.style.display = "flex";
		this.content.style.flexDirection = "row";

		// We have all the width available to the page.
		this.content.style.width = "100vw";

		// Now, append the drawer and then the body.
		if(this.drawer) {
			if(this.drawer instanceof Drawer) {
				// Oh-kay, this is nice to know.
				let drawer = this.drawer.render();

				// Just wait here till we are mounted, duh.
				while (!drawer.mounted) {
					drawer = drawer.render();
				}

				// Then we can append the header afterwards.
				this.content.appendChild(drawer.raw);
			}

			else {
				panic("The drawer of a page must be a Widget that inherits from the Drawer class.", this.drawer);
			}
		}

		// Finally, add the body of the entire page to the content.
		let body = this.body.render();

		// Just wait here till we are mounted, duh.
		while (!body.mounted) {
			body = body.render();
		}

		// Now, append the content of the page to itself.
		this.content.appendChild(body.raw);

		// Next, add the body to the widget.
		if(this.footer) {
			// Oh-kay, this is nice to know.
			let footer = this.footer.render();

			// Just wait here till we are mounted, duh.
			while (!footer.mounted) {
				footer = footer.render();
			}

			// Then we can append the footer afterwards.
			this.raw.appendChild(footer.raw);
		}

		// After everyhint, append the content of the page to the viewable screen.
		this.raw.appendChild(this.content);

		// You can do this then.
		this.mounted = true;
		return this;
	}
}

export {
	PageView,
}
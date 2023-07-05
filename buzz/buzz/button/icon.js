import { StatelessWidget } from "../framework/widget.js";
import { Icon } from "../icon/icon.js";
import { InsetsGeometry } from "../style/insets.js";

class IconButton extends StatelessWidget {
    /**
	 * @type {function()}
	 */
	onDoubleClick;

	/**
	 * @type {function()}
	 */
	onClick;

	/**
	 * @type {function(boolean): any}
	 */
	onHover;

    /**
     * 
     * @param {Icon} icon 
     * @param {*} param1 
     */
	constructor(icon, {
		margin = InsetsGeometry.zero,
		onClick = undefined,
		onHover = undefined,
		onDoubleClick = undefined,
		enabled = true,
	} = {}) {
		super();

		// This is to style the button first and assign its defaults.
		this.icon       = icon;
		this.onClick    = onClick;
		this.onHover    = onHover;
		this.onDoubleClick= onDoubleClick;
		this.enabled    = enabled;
		this.margin		= margin;
		this.clickable 	= true;

		// Next, create 
		this.raw    = document.createElement("button");
		this.raw.classList.add("buzz-button-clickable"); 
		this.raw.id = this.key;
	}

    render(parent) {
        super.render(parent);

        
    }
}

export {
    IconButton
}
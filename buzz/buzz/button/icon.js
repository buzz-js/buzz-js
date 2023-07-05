import { StatelessWidget } from "../framework/widget.js";
import { Icon } from "../icon/icon.js";
import { TextButtonStyle } from '../button/text.js';
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
     */
	constructor(icon, {
		style = new TextButtonStyle(),
		padding = globalThis.buzzContext.theme.buttonTheme?.padding,
		margin = globalThis.buzzContext.theme.buttonTheme?.margin,
		onClick = undefined,
		onHover = undefined,
		onDoubleClick = undefined,
		enabled = true,
	} = {}) {
		super();

		// This is to style the button first and assign its defaults.
		this.icon       = icon;
		this.onClick    = function () { 
			if(onClick)
				onClick();
		}
		this.onHover    = function(hovering) {
			if(onHover) 
				onHover(hovering);
		};
		this.onDoubleClick= function() {
			if(onDoubleClick) 
				onDoubleClick();
		};

		this.clickable 	= true; // The icon becomes clickable
		this.enabled    = enabled;
		this.margin		= margin;
		this.padding 	= padding; 
		this.style 		= style;

		// Next, create 
		this.raw    = document.createElement("div");
		this.raw.classList.add("buzz-button-clickable"); 
		this.raw.id = this.key;
	}

    render(parent) {
        super.render(parent);

		// If this is not an Icon...
		if(!this.icon || !this.icon instanceof Icon) {
			panic("Attempted to render an IconButton with a child that is not an Icon.", this);
		}

		// First, apply the styles that are general to these lads.
		this.applyStyle();

		// Retrieve the Widget in question.
		const widget = this.icon.mounted ? this.icon : this.icon.render();
		widget.parent = this;
		widget.ancestor = this;

		// This marks the time to render the icon.
		this.raw.innerHTML = widget.raw.outerHTML;

		// Mount this lad and then report this operation to the user.
		this.mounted = true;
		return this;
    }
}

export {
    IconButton
}
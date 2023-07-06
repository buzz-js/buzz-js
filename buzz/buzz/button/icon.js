import { StatelessWidget } from "../framework/widget.js";
import { Icon } from "../icon/icon.js";
import { TextButtonStyle } from '../button/text.js';
import { InsetsGeometry } from "../style/insets.js";


const handleMouseDown = function(_this, ev) {
	// If this has been entered..., don't repeat it.
	if(_this.raw.getAttribute("buzz-button-down")) {
		return;
	}

	// Check the moment this started.
	const moment = Date.now();

	// First, add this to the widget.
	_this.raw.setAttribute("buzz-button-down", moment.toString());
}

const handleMouseUp = function(_this, ev) {
	const moment = Date.now(); // As soon as you enter, get the current timestamp.
	const started = Number.parseInt(_this.raw.getAttribute("buzz-button-down"));

	const diff = moment - started;

	if(diff < 1500) { // If this is not long enough to be a long press...
		_this.onClick();
	}

	else {
		_this.onLongClick();
	}

	// Remove the attribute.
	_this.raw.removeAttribute("buzz-button-down"); 
}

const handleDoubleClick = function(_this, ev) {
	_this.onDoubleClick();
}

const handleMouseEnter = function(_this, ev) {
	// If this has been entered..., don't repeat it.
	if(_this.raw.getAttribute("buzz-button-hover")) {
		return;
	}

	_this.onHover(true);
	_this.raw.setAttribute("buzz-button-hover", Date.now().toString());
}

const handleMouseLeave = function(_this, ev) {
	_this.onHover(false);
	_this.raw.removeAttribute("buzz-button-hover");
}

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
		onLongClick = undefined,
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
		this.onLongClick = function () {
			if(onLongClick) 
				onLongClick();
		};

		this.clickable 	= true; // The icon becomes clickable
		this.enabled    = enabled;
		this.margin		= margin;
		this.padding 	= padding; 
		this.style 		= style;

		// Next, create the HTML element.
		this.raw    = document.createElement("div");
		this.raw.classList.add("buzz-button-clickable"); 
		this.raw.id = this.key;

		// Now, bind the listeners.
		this.raw.addEventListener("mouseover", (ev) => {
			handleMouseEnter(this, ev);
		});

		this.raw.addEventListener("mouseleave", (ev) => {
			handleMouseLeave(this, ev);
		});

		this.raw.addEventListener("dblclick", (ev) => {
			handleDoubleClick(_this, ev);
		});

		this.raw.addEventListener("mousedown", (ev) => {
			handleMouseDown(this, ev);
		});

		this.raw.addEventListener("mouseup", (ev) => {
			handleMouseUp(this, ev);
		});
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
		this.raw.appendChild(widget.raw);

		// Mount this lad and then report this operation to the user.
		this.mounted = true;
		return this;
    }
}

export {
    IconButton
}
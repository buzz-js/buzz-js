import { Icon } from "../../icon/icon.js";
import { TextButtonStyle } from './text.js';
import { InsetsGeometry } from "../../style/insets.js";
import { panic } from "../../framework/utilities.js";
import { StatelessWidget } from "../../framework/widget.js";


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
	if(_this.onDoubleClick !== null) {
		_this.onDoubleClick();
	}

	else {
		_this.onClick();
	}
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
	onLongClick;

	/**
	 * @type {function()}
	 */
	onClick;

	/**
	 * @type {function(boolean): any}
	 */
	onHover;

	getIcon() {
		return this.icon;
	}

    /**
     * 
     * @param {Icon} icon
     */
	constructor(icon, {
		onReactState = null,
		style = new TextButtonStyle(),
		padding = InsetsGeometry.zero,
		margin = InsetsGeometry.zero,
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
		this.onReactState = onReactState;

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
			handleDoubleClick(this, ev);
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
		if(!this.icon || !(this.icon instanceof Icon)) {
			panic("Attempted to render an IconButton with a child that is not an Icon.", this);
		}

		// First, apply the styles that are general to these lads.
		this.applyStyle();

		// Handle the err... enablement of the button 
		if(this.enabled && (this.onClick || this.onHover || this.onDoubleClick || this.onLongClick)) {
			this.raw.classList.add("enabled");
		}

		else {
			this.raw.classList.remove("enabled");
		}

		// Retrieve the Widget in question.
		const wasMounted = this.icon.mounted;
		const widget = this.icon.mounted ? this.icon : this.icon.render();
		widget.parent = this;
		widget.ancestor = this;

		// If this wasn't always mounted... 
		if(!wasMounted) {
			this.icon.postRender(this.context);
		}

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
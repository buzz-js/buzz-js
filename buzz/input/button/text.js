import { panic } from '../../framework/utilities.js';
import { StatelessWidget } from '../../framework/widget.js';
import { MATCH_CONTENT } from '../../style/style.js';
import { TextStyle } from '../../text/text.js';

class TextButtonStyle extends TextStyle {
	constructor({
		fontColor = globalThis.buzzContext.theme.buttonTheme?.fontColor,
		fontFamily = globalThis.buzzContext.theme.buttonTheme?.fontFamily,
		border = globalThis.buzzContext.theme.buttonTheme?.border,
		fontSize = globalThis.buzzContext.theme.buttonTheme?.fontSize,
		fontWeight = globalThis.buzzContext.theme.buttonTheme?.fontWeight,
		borderRadius = globalThis.buzzContext.theme.buttonTheme?.borderRadius,
		backgroundColor = globalThis.buzzContext.theme.buttonTheme?.backgroundColor,
		backgroundColorDisabled = globalThis.buzzContext.theme.buttonTheme?.backgroundColorDisabled,
		fontColorDisabled = globalThis.buzzContext.theme.buttonTheme?.fontColorDisabled,
		backgroundColorHover = globalThis.buzzContext.theme.buttonTheme?.backgroundColorHover,
		fontColorHover = globalThis.buzzContext.theme.buttonTheme?.fontColorHover,
		height = MATCH_CONTENT,
		width = MATCH_CONTENT
	} = {}) {
		super({
			fontColor: fontColor,
			fontFamily: fontFamily,
			overflowType: TextStyle.OVERFLOW_TRUNCATE,
			border: border,
			borderRadius: borderRadius,
			backgroundColor: backgroundColor,
			height: height,
			width: width,
		});

		this.backgroundColorDisabled = backgroundColorDisabled;
		this.fontColorDisabled = fontColorDisabled;
		this.backgroundColorHover = backgroundColorHover;
		this.fontColorHover = fontColorHover;
		this.fontSize = fontSize;
		this.fontWeight = fontWeight;
	}
}

class TextButton extends StatelessWidget {
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

	constructor(text, {
		padding = globalThis.buzzContext.theme.buttonTheme?.padding,
		margin = globalThis.buzzContext.theme.buttonTheme?.margin,
		style = new TextButtonStyle(),
		onClick = undefined,
		onHover = undefined,
		onDoubleClick = undefined,
		onLongClick = undefined,
		enabled = true,
	} = {}) {
		super();

		// This is to style the button first and assign its defaults.
		this.text       = text;
		this.style      = style;
		this.onClick    = function() {
			if(onClick) onClick();
		};

		this.onHover    = function(hovering) {
			//delete this.raw;
			//this.raw = document.getElementById(this.key);

			if(hovering) {	
				this.raw.style.background 	= this.style.backgroundColorHover;
				this.raw.style.color		= this.style.fontColorHover;
			}

			else {
				this.raw.style.background 	= this.style.backgroundColor;
				this.raw.style.color		= this.style.fontColor;
			}

			// Now call the hovering function for this guy.
			if(onHover)  // If it is bound
				onHover(hovering);
		}
		this.onDoubleClick= function () {
			if(onDoubleClick)
				onDoubleClick();
		}
		this.onLongClick = function () {
			if(onLongClick) 
				onLongClick();
		};
		this.enabled    = enabled;
		this.margin		= margin;
		this.padding = padding;

		// Next, create 
		this.raw    = document.createElement("button");
		this.raw.classList.add("buzz-button-clickable");
		this.raw.id = this.key;
		this.libraryWidget = true;

		// First bind the hover listener.
		this.raw.addEventListener("mouseover", (ev) => {
			this.onHover(true);
		});

		this.raw.addEventListener("mouseleave", (ev) => {
			this.onHover(false);
		});

		this.raw.addEventListener("dblclick", (ev) => {
			this.onDoubleClick();
		});

		this.raw.addEventListener("mousedown", (ev) => {
			// Check the moment this started.
			const moment = Date.now();

			// First, add this to the widget.
			this.raw.setAttribute("buzz-button-down", moment.toString());
		});

		this.raw.addEventListener("mouseup", (ev) => {
			const moment = Date.now(); // As soon as you enter, get the current timestamp.
			const started = Number.parseInt(this.raw.getAttribute("buzz-button-down"));

			const diff = moment - started;

			if(diff < 1500) { // If this is not long enough to be a long press...
				this.onClick();
			}

			else {
				this.onLongClick();
			}

			// Remove the attribute.
			this.raw.removeAttribute("buzz-button-down"); 
		});
	}

	remove(context) {
		super.remove(context);

		delete this.onClick;
		delete this.onHover;
		delete this.onDoubleClick;
	}

	render(parent) {
		super.render(parent);

		// First, let's apply the styling.
		if(this.enabled) {
			this.raw.style.background 	= this.style.backgroundColor;
			this.raw.style.color		= this.style.fontColor;
			this.raw.style.cursor		= "pointer";
		}

		else {
			this.raw.style.background 	= this.style.backgroundColorDisabled;
			this.raw.style.color		= this.style.fontColorDisabled;
			this.raw.style.cursor		= "initial";
		}

		// First, apply the general styling.
		this.applyStyle();

		// Handle the err... enablement of the button 
		if(this.enabled && (this.onClick || this.onHover || this.onDoubleClick || this.onLongClick)) {
			this.raw.classList.add("enabled");
		}

		else {
			this.raw.classList.remove("enabled");
		}

		// Now the font style
		this.raw.style.fontSize 		= this.style.fontSize;
		this.raw.style.fontWeight		= this.style.fontWeight;
		this.raw.style.fontFamily		= this.style.fontFamily;

		if(this.style.border) {
			this.raw.style.borderWidth = this.style.border.lineWidth;
			this.raw.style.borderColor = this.style.border.color;
			this.raw.style.borderStyle = this.style.border.lineType;
		}

		if(this.style.borderRadius) {
			this.raw.style.borderTopLeftRadius 		= this.style.borderRadius.topLeft;
			this.raw.style.borderTopRightRadius 	= this.style.borderRadius.topRight;
			this.raw.style.borderBottomLeftRadius 	= this.style.borderRadius.bottomLeft;
			this.raw.style.borderBottomRightRadius 	= this.style.borderRadius.bottomRight; 
		}

		// Set the text inside the button
		this.raw.innerText = this.text;

		// Mount this button when you're done.
		this.mounted = true;
		return this;
	}

	postRender(context) {
		super.postRender(context);
	}
}

export {
	TextButton,
	TextButtonStyle
}
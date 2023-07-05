import { panic } from '../framework/utilities.js';
import { StatelessWidget } from '../framework/widget.js';
import { InsetsGeometry } from '../style/insets.js';
import { MATCH_CONTENT } from '../style/style.js';
import { TextStyle } from '../text/text.js';

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
		padding = globalThis.buzzContext.theme.buttonTheme?.padding,
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
		this.padding = padding;
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
		margin = InsetsGeometry.zero,
		style = new TextButtonStyle(),
		onClick = undefined,
		onHover = undefined,
		onDoubleClick = undefined,
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
			delete this.raw;
			this.raw = document.getElementById(this.key);

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
		this.onDoubleClick= onDoubleClick;
		this.enabled    = enabled;
		this.margin		= margin;
		this.clickable 	= true;

		// Next, create 
		this.raw    = document.createElement("button");
		this.raw.classList.add("buzz-button-clickable");
		this.raw.id = this.key;
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

		// Next, set the margin for the child view.
		if(this.margin) {
			this.raw.style.marginTop 	= this.margin?.top;
			this.raw.style.marginBottom	= this.margin?.bottom;
			this.raw.style.marginLeft 	= this.margin?.left;
			this.raw.style.marginRight 	= this.margin?.right;
		}

		// Now the font style
		this.raw.style.fontSize 		= this.style.fontSize;
		this.raw.style.fontWeight		= this.style.fontWeight;
		this.raw.style.fontFamily		= this.style.fontFamily;


		if(this.style.padding) {
			this.raw.style.paddingTop 	= this.style.padding?.top;
			this.raw.style.paddingBottom= this.style.padding?.bottom;
			this.raw.style.paddingLeft 	= this.style.padding?.left;
			this.raw.style.paddingRight = this.style.padding?.right;
		}

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
		this.raw.innerHTML = this.text;

		// Mount this button when you're done.
		this.mounted = true;
		return this;
	}
}

export {
	TextButton,
	TextButtonStyle
}
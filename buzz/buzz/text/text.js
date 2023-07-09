import { StatelessWidget } from "../framework/widget.js";
import { MATCH_CONTENT, WidgetStyle } from "../style/style.js";
import { InsetsGeometry, RadialGeometry } from "../style/insets.js";
import { AppContext } from "../framework/context.js";
import { View, VISIBLE } from "../render/view.js";
import { Border } from "../style/border.js";
import { FontFamily } from "./font.js";
import { panic } from "../framework/utilities.js";

class TextStyle extends WidgetStyle {
	static OVERFLOW_ELLIPSIS = 'ellipsis';
	static OVERFLOW_TRUNCATE = 'clip';
	static OVERFLOW_SCROLL 	 = 'scroll';

	/**
	 * @type {string} A CSS-style color.
	 */
	fontColor;

	/**
	 * Typically, one of the members of the FontFamily class.
	 *
	 * @type {string}
	 */
	fontFamily;

	/**
	 * How do you want it to overflow? An ellipsis, or a truncation?
	 *
	 * @type {string}
	 */
	overflowType;

	/**
	 * @type {Border}
	 */
	border;

	/**
	 * @type {RadialGeometry}
	 */
	borderRadius;


	/**
	 * 
	 * @param {string} fontColor 
	 * @param {string} fontFamily 
	 * @param {string} overflowType 
	 * @param {Border} border 
	 */
	constructor({
		fontColor = globalThis.buzzContext.theme.textTheme?.fontColor,
		fontFamily = globalThis.buzzContext.theme.textTheme?.fontFamily,
		fontWeight = globalThis.buzzContext.theme.textTheme?.fontWeight,
		overflowType = null,
		border = globalThis.buzzContext.theme.textTheme?.border,
		borderRadius = globalThis.buzzContext.theme.textTheme?.borderRadius,
		backgroundColor = globalThis.buzzContext.theme.textTheme?.backgroundColor,
		height = MATCH_CONTENT,
		width = MATCH_CONTENT
	} = {}) {
		super(fontColor,  { 
			background: backgroundColor,
			height: height, 
			width: width 
		});

		this.fontColor = fontColor;
		this.fontFamily = fontFamily;
		this.fontWeight = fontWeight;
		this.overflowType = overflowType;
		this.border = border;
		this.borderRadius = borderRadius;
	}
}

class Text extends StatelessWidget {
	/**
	 * The style of this text widget. This is the formatting information we would be using for this text widget.
	 * 
	 * @type {TextStyle}
	 */
	style;

	/**
	 * The maximum number of lines to show in the Text associated with this style before we begin to truncate. When we do this,
	 * we technically just make things simpler for ourselves.
	 *
	 * @type {number}
	 */
	 maxLines;

	/**
	  * @type {string} A CSS-style dimension
	 */
	fontSize;


	get value(){
		return this.raw.innerText;
	}

	set value(value) {
		if(typeof value != 'string') {
			panic("Expected a string as the value of the Text widget with the ID " + this.key + " but got " + value.constructor.name + " instead.", this);
		}

		if(this.raw !== null) {
			// If this Widget has already been rendered.
			// Update its contents
			this.raw.innerText = value;
		}
	}

	/**
	 * This creates a new Text widget with the text specified and the 
	 *
	 * @param {number} maxLines The number of lines inside this Text widget.
	 * @param {string} text The text this Text box is supposed to contain. 
	 * @param {TextStyle} style The styling information for this Text widget.
	 * @param {InsetsGeometry} padding The padding inside this text box.
	 * @param {InsetsGeometry} margin The margin around this Text box.
	 * @param {string} fontSize	The size of the font inside this Text widget.
	 */
	constructor(text, {
		style = null,
		padding = globalThis.buzzContext.theme.textTheme?.padding,
		margin = globalThis.buzzContext.theme.textTheme?.margin,
		fontSize = globalThis.buzzContext.theme.textTheme?.fontSize,
		maxLines = 1
	}= {}) {
		// First, call the super constructor so that it can set up everything required for
		// fundamental widgets.
		super();

		// This is all the information about the widget in its own way, I guess.
		this.style = style;
		this.maxLines = maxLines;
		this.fontSize = fontSize;

		// Attach the additional styling to this guy.
		this.padding = padding;
		this.margin = margin;

		//  Next thing to do would be to generate the associated HTML node.
		this.raw = document.createElement("p");

		// At this point the widget's key has been generated so this assignment is valid.
		this.raw.id = this.key;

		// Make the viewport.
		this.viewport = new View(this.raw);

		// Finally, bind the text.
		this.raw.innerText = text;
	}

	/**
	 * 
	 * @param {AppContext} context 
	 */
	render(parent) {
		super.render(parent);

		// The context first.
		const context = globalThis.buzzContext;

		// If this has not been built before which is technically impossible...
		if(this.visibility === VISIBLE && this.raw.style.display === "none") {
			this.raw.style.display = "block";
		}

		// No overflows, and this is not scrollable.
		// It logically should not just be.
		this.raw.style.overflow = 'hidden';

		// First, apply the right styling to this Widget at base first.
		this.applyStyle();

		// If a this is text on a single line, I would permit scrolling horizontally.
		if(this.maxLines > 1) {
			// If this is a multi-line text field, do well to create a desirable kind of overflow.
			// Only at the tail end downwards.
			this.raw.style.overflowWrap = "break-word";
			this.raw.style.webkitLineClamp = this.maxLines;
			this.raw.style.display = "-webkit-box";

			// Set the box orientation to vertical
			this.raw.style.setProperty('-webkit-box-orient', 'vertical');
		}

		if(this.fontSize !== null)  {
			this.raw.style.fontSize = this.fontSize;
		}

		// Moving forward, it is time for the text styling....
		if(this.style !== null) { // Inline styling takes the first precedent
			this.raw.style.color 		= this.style.color;
			this.raw.style.fontFamily 	= this.style.fontFamily;
			this.raw.style.fontWeight 	= this.style.fontWeight;
			this.raw.style.width 		= this.style.width;
			this.raw.style.height 		= this.style.height;

			if(this.style.overflowType !== null && this.style.overflowType !== undefined) {
				if(this.style.overflowType === TextStyle.OVERFLOW_SCROLL) {
					if(this.maxLines > 1) {
						this.raw.style.overflowY = "scroll";
					}

					else {
						this.raw.style.overflowX = "scroll";
					}
				}

				else {
					this.raw.style.textOverflow = this.style.overflowType;
				}
			}
		}

		// If there is no inline styling, and the global theme is not null....
		else if(context.theme !== null) {
			// Taking the long way around.
			// The default width of any text widget is to wrap around its content.
			this.raw.style.width = 'fit-content';
			this.raw.style.color = context.theme.textTheme?.fontColor;
			this.raw.style.fontFamily = context.theme.textTheme?.fontFamily;
			this.raw.style.paddingTop = context.theme.textTheme?.padding.top;
			this.raw.style.paddingBottom = context.theme.textTheme?.padding.bottom;
			this.raw.style.paddingLeft = context.theme.textTheme?.padding.left;
			this.raw.style.paddingRight = context.theme.textTheme?.padding.right;
			this.raw.style.border = context.theme.textTheme?.border?.toStylesheet();
		}

		// If there are no presets to use, move forward like this.
		else {
			// Attach the default styling options to this guy.
			this.raw.style.color = 'black';
			this.raw.style.fontFamily = FontFamily.FONT_FAMILY_LATO;
			this.raw.style.padding = '5px';

			// The default width of any text widget is to wrap around its content.
			this.raw.style.width = 'fit-content';
		}

		// This has been built and mounted.
		this.mounted = true;
		return this;
	}

	// This is purely for debugging purposes 
	postRender(context) {
		super.postRender(context);
	}
}

export {
	Text,
	TextStyle,
}

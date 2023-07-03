import { BoxShadow } from "./shadow.js";

/**
 * This value corresponds to the horizontal width of the entire screen.
 */
const SCREEN_WIDTH 	= '100vw';

/**
 * This height corresponds to the vertical height of the entire screen.
 */
const SCREEN_HEIGHT = '100vh';

/**
 * This corresponds to the relevant dimension of the widget itself.
 */
const MATCH_CONTENT	= 'fit-content';

/**
 * This corresponds to the relevant dimension as owned by the parent of the widget directly.
 */
const MATCH_PARENT 	= 'inherit'; 


/**
 * Just let the browser decide what to do with it by itself.
 */
const STYLE_AUTOMATIC = 'auto';

class WidgetStyle {
	/**
	 * The color of this widget.
	 * 
	 * @type {string}
	 */
	color;

	/**
	 * The background color of this given widget.
	 * 
	 * @type {string}
	*/
	backgroundColor;

	/**
	 * The height of this widget
	 * 
	 * @type {string} A CSS-style dimension.
	 */
	height;

	/**
	 * @type {string} A CSS-style dimension.
	 */
	width;

	/**
	 * Sets the shadow around the border of a Widget only when applicable.
	 *
	 * @type {BoxShadow}
	 */
	shadow;

	constructor(color = null, {
		background = null,
		height = null,
		width = null,
		shadow = null
	} = {}) {
		this.color = color;
		this.backgroundColor = background;
		this.height = height;
		this.shadow = shadow?.toStylesheet();
		this.width = width;
	}
}

export {
	WidgetStyle,
	MATCH_CONTENT,
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	STYLE_AUTOMATIC,
	MATCH_PARENT
}
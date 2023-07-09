import { Container, ContainerStyle } from "../framework/container.js";
import { panic, visibilityCheck } from "../framework/utilities.js";
import { View } from "../render/view.js";
import { BuzzStyleAttribute } from "../style/native.js";
import { MATCH_CONTENT } from "../style/style.js";
import { Flexible } from "./flexible.js";


/**
 * The static class containing constants for all possible means to align content.
 */
class FlexAlignment extends BuzzStyleAttribute {
	/**
	 * Align the content to the center of the associated flexbox.
	 */
	static center 		= 'center';

	/**
	 * Align the content to the end of and axis of the associated flexbox.
	 */
	static end 			= 'flex-end';

	/**
	 * Align the content to the start of the axis of the associated flexbox.
	 */
	static start 		= 'flex-start';

	/**
	 * Align this to the baseline for the axis of the associated flexbox.
	 */
	static baseline 	= 'baseline';

	/**
	 * Stretch this across the axis of the associated flex box.
	 */
	static stretch		= 'stretch';

	/**
	 * Space the content inside an axis in this flex box such that the space around them are equal. This means, to the left and right of
	 * any of the children, there would be the same space. In the case where there is only one child, this has the same effect as center.
	 */
	static spaceAround	= 'space-around';

	/**
	 * The items in this flex box are evenly distributed in the line such that the first item starts on the start line, and the last item ends on the end line.
	 * Essentially, the space left after padding and margin are removed is distributed such that the gap between its children is equal.
	 */
	static spaceBetween	= 'space-between';

	/**
	 * The items in the flex box have spacing distributed such that the the spacing between any two adjacent alignment subjects, before
	 * the first alignment subject, and after the last alignment subject is the same. Essentially, it means the space between the first
	 * child and the starting line; the last child and the ending line; and any two children would always be the same when checked.
	 */
	static spaceEvenly	= 'space-evenly';
}


/**
 * Create a new Container explicitly based off the CSS flexbox specifications. It lays out its children flexibly and the spacing,
 * position, and order of the children can be changed dynamically and is calculated using information inside the styling of this
 * Widget.
 * 
 * One thing to note is the flex direction. If the flex direction of this Flex widget is horizontal, that would mean its main axis
 * is the horizontal axis and its cross axis is the vertical. Likewise, if the flex widget has a flex direction of vertical, it would
 * mean the main axis is the vertical axis, and the cross axis is the horizontal axis.
 * 
 * A Flex widget should rarely ever be used directly because there is little to no need to do so. The Buzz framework helps you by
 * creating classes for the most popular use cases this can ever give you. 
 */
class Flex extends Container {
	/**
	 * Meaning you want your layout to be horizontal.
	 */
	static directionHorizontal 	= 'row';

	/**
	 * Meaning you want your layout to be vertical.
	 */
	static directionVertical 	= 'column';

	/**
	 * Creates a new Flex container using the information specified.
	 *
	 * @param {string} flexDirection The direction we should lay this Flex widget out in. Should usually be Flex.directionHorizontal or Flex.directionVertical
	 * @param {Flexible[]?} children  The children of this Flex widget.
	 * @param {boolean?} reversed Do we render the children inside of this Flex in the reverse order?
	 * @param {ContainerStyle?} style The styling to use for this Flex Widget.
	 * @param {boolean}	wrap Should the contents of this Flex widget move to a new position in the cross axis when they detect an overflow?
	 * @param {string} mainAxisAlignment How should the children of this flex widget be aligned in its main axis?
	 * @param {string} crossAxisAlignment How should the items inside of this Flex widget be aligned in the cross axis?
	 * @param {string} contentJustification How should the items in this Flex be aligned in extra space if they span multiple lines in the cross axis?
	 */
	constructor(
		flexDirection, {
		children = null,
		reversed = false,
		style = new ContainerStyle({
			backgroundColor: 'transparent',
			height: MATCH_CONTENT,
			width: MATCH_CONTENT
		}),
		margin = undefined,
		padding = undefined,
		wrap = false,
		mainAxisAlignment = FlexAlignment.start,
		crossAxisAlignment = FlexAlignment.center,
		contentAlignment = FlexAlignment.start
	} = {}) {
		super({
			children: children,
			style: style
		});

		// The next thing we do here is create the information for the flexbox Widget.
		this.reversed = reversed;
		this.direction = flexDirection;
		this.wrap = wrap;
		this.mainAxisAlignment = mainAxisAlignment;
		this.crossAxisAlignment = crossAxisAlignment;
		this.contentAlignment = contentAlignment;
		this.margin = margin;
		this.padding = padding;

		// Next it is time to create the HTML Element for this dude.
		this.raw 	= document.createElement("div");
		this.raw.id = this.key;

		// Next, create the viewport.
		this.viewport = new View(this.raw);
	}

	render(parent) {
		super.render(parent); // First, call the implementation of super.

		// First, do the classic visibility check
		visibilityCheck(this, 'flex');

		// First, we need to make sure that this Widget is in fact a flexbox.
		this.raw.style.display = 'flex'; 

		// Next, we do the basic styling to the Flex container.
		this.applyStyle();



		// Work with the flex direction.
		if(this.direction === Flex.directionHorizontal) {
			this.raw.style.flexDirection = this.reversed === true ? 'row-reverse' : 'row';
		}

		else if(this.direction === Flex.directionVertical) {
			this.raw.style.flexDirection = this.reversed === true ? 'column-reverse' : 'column';
		}

		else {
			panic("Unexpected flex direction value " + this.flexDirection + ". Did you try using your own string constant instead? ", this);
		}

		// Axis based alignments come next.


		// Next, we handle the main axis alignment.
		if(this.mainAxisAlignment) { // If there is any main axis alignment specified.
			this.raw.style.justifyContent = this.mainAxisAlignment;
		}

		// Net we handle the cross axis alignment.
		if(this.crossAxisAlignment) {
			this.raw.style.alignItems = this.crossAxisAlignment;
		}

		// Next, we apply content justification.
		if(this.alignContent) {
			this.raw.style.alignContent = this.contentAlignment;
		}


		// Next, it is time to handle the flex wrap.
		this.raw.style.flexWrap = this.wrap ? "wrap" : "nowrap";

		// Finally, render the children.
		this.renderChildren();

		// This widget has been built and mounted.
		this.mounted = true;
		return this;
	}
}


export {
	Flex,
	FlexAlignment
}
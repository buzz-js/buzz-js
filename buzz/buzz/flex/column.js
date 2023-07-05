import { ContainerStyle } from "../framework/container.js";
import { Colors } from "../style/color.js";
import { MATCH_CONTENT } from "../style/style.js";
import { Flex, FlexAlignment } from "./flex.js";


/**
 * This widget is a flexbox that has its main axis on the vertical plane. It should typically be used 
 */
class Column extends Flex {
	/**
	 * Creates a new Flex container with a vertical main axis.
	 *
	 * @param {Flexible[]?} children  The children of this Column widget.
	 * @param {boolean?} reversed Do we render the children inside of this Column in the reverse order?
	 * @param {ContainerStyle?} style The styling to use for this COlumn Widget.
	 * @param {string} mainAxisAlignment The vertical alignment of the children of this column
	 * @param {string} crossAxisAlignment The horizontal alignment of the children of this column.
	 */
	constructor({
		children = null,
		reversed = false,
		style = new ContainerStyle({
			backgroundColor: Colors.transparent,
			height: MATCH_CONTENT,
			width: MATCH_CONTENT
		}),
		margin = undefined,
		padding = undefined,
		mainAxisAlignment = FlexAlignment.start,
		crossAxisAlignment = FlexAlignment.center,
	} = {}) {
		super(Flex.directionVertical, {
			children: children,
			reversed: reversed,
			style: style,
			margin: margin,
			padding: padding,
			mainAxisAlignment: mainAxisAlignment,
			crossAxisAlignment: crossAxisAlignment,
		});
	}

	render(parent) {
		// Let the Flex superclass handle everything for you.
		return super.render(parent);
	}
}

export {
	Column,
	FlexAlignment,
}
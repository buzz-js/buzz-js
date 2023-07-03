import { Colors } from "../style/color.js";
import { MATCH_CONTENT } from "../style/style.js";
import { Flex, FlexAlignment } from "./flex.js";

class Row extends Flex {
	/**
	 * Creates a new Flex container with a vertical main axis.
	 *
	 * @param {Flexible[]?} children  The children of this Row widget.
	 * @param {boolean?} reversed Do we render the children inside of this Row in the reverse order?
	 * @param {ContainerStyle?} style The styling to use for this Row Widget.
	 * @param {string} mainAxisAlignment The horizontal alignment of the children of this row
	 * @param {string} crossAxisAlignment The vertical alignment of the children of this row.
	 */
	constructor({
		children = null,
		reversed = false,
		style = new ContainerStyle({
			backgroundColor: Colors.transparent,
			height: MATCH_CONTENT,
			width: MATCH_CONTENT
		}),
		mainAxisAlignment = FlexAlignment.start,
		crossAxisAlignment = FlexAlignment.center,
	} = {}) {
		super(Flex.directionHorizontal, {
			children: children,
			reversed: reversed,
			style: style,
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
	Row,
	FlexAlignment,
}
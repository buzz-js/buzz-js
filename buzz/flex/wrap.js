import { MATCH_CONTENT } from "../style/style.js";
import { Flex, FlexAlignment } from "./flex.js";

/**
 * This class is used to generate a special kind of flexible container which has Widgets that wrap around each other inside of 
 * itself. It is meant to be used when you do not desire any horizontal overflow and don't want the default behavior where when a
 * Widget extends out of the bounds of a viewport, it becomes scrollable in a flex view.
 */
class Wrap extends Flex {
	/**
	 * Creates a new Wrap container using the information specified.
	 *
	 * @param {string} flexDirection The direction we should lay this Wrap widget out in. Should usually be Flex.directionHorizontal or Flex.directionVertical
	 * @param {Flexible[]?} children  The children of this Wrap widget.
	 * @param {boolean?} reversed Do we render the children inside of this Wrap in the reverse order?
	 * @param {ContainerStyle?} style The styling to use for this Wrap Widget.
	 * @param {string} mainAxisAlignment How should the children of this flex widget be aligned in its main axis?
	 * @param {string} crossAxisAlignment How should the items inside of this Flex widget be aligned in the cross axis?
	 * @param {string} contentJustification How should the items in this Flex be aligned in extra space if they span multiple lines in the cross axis?
	 */
	 constructor( {
		flexDirection = Flex.directionHorizontal,
		children = null,
		reversed = false,
		style = new ContainerStyle({
			backgroundColor: 'transparent',
			height: MATCH_CONTENT,
			width: MATCH_CONTENT
		}),
		mainAxisAlignment = FlexAlignment.start,
		crossAxisAlignment = FlexAlignment.center,
		contentAlignment = FlexAlignment.start
	} = {}) {
		// Next we can think of creating this 
		super(flexDirection, {
			children: children,
			wrap: true,
			reversed: reversed,
			style: style,
			mainAxisAlignment: mainAxisAlignment,
			crossAxisAlignment: crossAxisAlignment,
			contentAlignment: contentAlignment
		});
	}

	render(parent) {
		return super.render(parent);
	}
}

export {
	Wrap
}
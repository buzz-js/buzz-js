import { StatelessWidget} from '../framework/widget.js';
import { BuzzStyleAttribute, NativeStyleElement } from '../style/native.js';

/**
 * The Buzz class that controls icons and their animations. Typically, this is 
 * used for animating icons that are supposed to move some certain way or the
 * other. It contains a host of simple animations like beats, pulses, rotation,
 * motion, and fade.
 */
class IconAnimation extends NativeStyleElement {
	/**
	 * The constant meaning there is associated animation which is just a fancy way of
	 * saying we don't want this icon to move.
	 *
	 * @type {IconAnimation}
	 */
	static none		= IconAnimation();

	/**
	* The animation type that is used when the icon should rotate on the screen.
	*/
	static ANIMATION_ROTATE = 'fa-rotate';

	/**
	* The animation type that is used when the icon should beat like a living 
	* heart on the screen.
	*/
	static ANIMATION_BEAT = 'fa-beat';

	/**
	* The animation type that is used when the icon should move on some axis without
	* moving the screen.
	*/
	static ANIMATION_MOVE = 'fa-translate';

	/**
	* The animation type that is used when the icon should pulsate on the screen.
	*/
	static ANIMATION_PULSE = 'fa-pulse';

	/**
	 * The type of animation this is.
	 */
	type;
}

class Icon extends StatelessWidget {
	/**
	 * The specific icon inside this icon file.
	 *
	 * @type {BuzzStyleAttribute}
	 */
	data;

	constructor({
		height 	= '1em',
		width 	= '1em',
		type	=  undefined
	} = {}) {
		super();
	}
}

export {
	Icon
}
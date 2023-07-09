import { StatelessWidget} from '../framework/widget.js';
import { NativeStyleElement } from '../style/native.js';
import { AnimationController } from '../animation/anim.js';
import { InsetsGeometry } from '../style/insets.js';

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
	static none		= new IconAnimation('none');

	/**
	* The animation type that is used when the icon should rotate on the screen.
	*/
	static TYPE_ROTATE = 'fa-flip';

	/**
	* The animation type that is used when the icon should pulsate on the screen.
	*/
	static TYPE_PULSE = 'fa-beat-fade';

	/**
	* The animation type that is used when the icon should beat like a living 
	* heart on the screen.
	*/
	static TYPE_BEAT = 'fa-beat';

	/**
	 * The animation type that corresponds to a bouncing effect on the icon. A certain
	 * up and down motion, if you will. Like a bouncing ball.
	 */
	static TYPE_BOUNCE = 'fa-bounce';

	/**
	 * This is the animation type that denotes that the icon should shake. Useful for
	 * grabbing attention.
	 */
	static TYPE_SHAKE = 'fa-shake';
	
	/**
	 * This is the animation type that denotes that the icon should spin.
	 */
	static TYPE_SPIN = 'fa-spin';

	/**
	 * The animation controller bound to this animation. It is used to start, stop,
	 * rewind and do all sorts of things to this animation.
	 *
	 * @type {AnimationController}
	 */
	controller;

	/**
	 * This is one of the values relevant to the animation you are using. For beat, this
	 * is the maximum scale that this icon should grow to and from. Values less than 1 but
	 * greater than 0 indicate that the icon would shrink. Values grater than 1 indicate that
	 * the icon would grow. Negative values mean the icon would invert about itself.
	 *
	 * For Fade and Pulse animations, this is the minimum opacity that the icon should dim to.
	 * 
	 * For Bounce animations, this is the amount of rebound an icon has when jumping up and
	 * down after landing.
	 * 
	 * For rotation animations, this is the x axis of the rotation. Value between 0 and 1.
	 * 
	 * For shake animations, this controls whether to shake or not.
	 * @type {number}
	 */
	scalar1;

	/**
	 * For pulse animations, this is the maximum scale the animation should grow/shrink to
	 * while pulsing.
	 * 
	 * For bounce animations, this is the maximum height the icon is allowed to go to while
	 * bouncing.
	 * 
	 * For rotation animations, this is the y axis of the rotation. Value between 0 and 1.
	 *
	 * @type {number}
	 */
	scalar2;

	/**
	 * For bounce animations, this is the horizontal distortion ("compression" or "squish")
	 * along the x-axis when the animation begins.
	 *
	 * For rotation animations this is the z-axis of the rotation. Value between 0 and 1.
	 *
	 * @type {number}
	 */
	scalar3;

	/**
	 * For bounce animations, this is the vertical distortion ("compression" or "squish")
	 * along the y-axis when the animation begins.
	 * 
	 * For rotation animations this is the angle that is to be considered as the 1 (full value)
	 * of all the axes rotation properties. Should be a scalar number suffixed with 'deg' to
	 * indicate that it is a degree or 'rad' in which case it is in radians. Basically, it
	 * should be a valid CSS degree value.
	 *
	 * @type {number}
	 */
	scalar4;

	/**
	 * For bounce animations, this is the horizontal distortion ("compression" or "squish")
	 * along the x-axis at the top of the jump.
	 *
	 * @type {number}
	 */
	scalar5;

	/**
	 * For bounce animations, this is the vertical distortion ("compression" or "squish")
	 * along the y-axis at the top of the jump.
	 *
	 * @type {number}
	 */
	scalar6;

	/**
	 * For bounce animations, this is the horizontal distortion ("compression" or "squish")
	 * along the x-axis after landing from the jump.
	 *
	 * @type {number}
	 */
	scalar7;

	/**
	 * For bounce animations, this is the vertical distortion ("compression" or "squish")
	 * along the y-axis after landing from the jump.
	 *
	 * @type {number}
	 */
	scalar8;

	constructor(type, {
		duration 	= '1s',
		delay 		= '0s',
		timing		= 'ease-in-out',
		direction 	= 'forward',
		progressive	= false, 
		iterations	= 1,
		controller  = undefined,
		// --fa-bounce-rebound, --fa-beat-scale, --fa-fade-opacity, 
		// --fa-beat-fade-opacity, --fa-flip-x, shouldShake
		scalar1		= 0,

		// --fa-bounce-height, --fa-beat-fade-scale, fa-flip-y
		scalar2		= 0,

		// --fa-bounce-start-scale-x, fa-flip-z
		scalar3		= 0,

		// --fa-bounce-start-scale-y, fa-flip-angle
		scalar4		= 0,

		// --fa-bounce-jump-scale-x
		scalar5		= 0,

		// --fa-bounce-jump-scale-y
		scalar6		= 0,

		// --fa-bounce-land-scale-x
		scalar7		= 0,

		// --fa-bounce-land-scale-y
		scalar8		= 0,
	} = {}) {
		super(); // First, call the super constructor.

		// Bind the duration of this icon animation
		this.duration 	= duration;
		this.delay 		= delay;
		this.timing		= timing;
		this.iterations	= iterations;
		this.type 		= type;
		this.progressive= progressive;
		this.direction 	= direction;
		this.controller = controller;
		this.scalar1 	= scalar1;
		this.scalar2 	= scalar2;
		this.scalar3 	= scalar3;
		this.scalar4	= scalar4;
		this.scalar5	= scalar5;
		this.scalar6	= scalar6;
		this.scalar7	= scalar7;
		this.scalar8	= scalar8;
	}
}

function styleIcon(icon) {
	// Now, we split this icon to different small groups.
	let classes = icon.data.split(' ');

	// First order of events is to add this to the class list.
	classes.forEach(element => {
		icon.raw.classList.add(element);
	});

	// Next, apply the generic styles.
	icon.applyStyle();

	// Next, bind the styling.
	icon.raw.style.color = icon.color;
	icon.raw.style.fontSize = icon.size;

	if(icon.animation && icon.animation instanceof IconAnimation) { // If this animation is actually useful.
		// First, we set the attributes that remain fairly constant throughout the versions.
		icon.raw.style.setProperty("--fa-animation-duration", icon.animation.duration);
		icon.raw.style.setProperty('--fa-animation-delay',	icon.animation.delay);
		icon.raw.style.setProperty("--fa-animation-timing", icon.animation.timing);
		icon.raw.style.setProperty("--fa-animation-iteration-count", icon.animation.iterations);
		icon.raw.style.setProperty("--fa-animation-direction", icon.animation.direction);

		// Next, assign the class value to icon animation.
		icon.raw.classList.add(icon.animation.type);

		// Finally, it is time to handle the icon animation customization.
		switch(icon.animation.type) {
			case IconAnimation.TYPE_BEAT: {
				icon.raw.style.setProperty("--fa-beat-scale", icon.animation.scalar1);
			}	break;

			case IconAnimation.TYPE_BOUNCE: {
				icon.raw.style.setProperty("--fa-bounce-rebound", icon.animation.scalar1);
				icon.raw.style.setProperty("--fa-bounce-height", icon.animation.scalar2);
				icon.raw.style.setProperty("--fa-bounce-start-scale-x", icon.animation.scalar3);
				icon.raw.style.setProperty("--fa-bounce-start-scale-y", icon.animation.scalar4);
				icon.raw.style.setProperty("--fa-bounce-jump-scale-x", icon.animation.scalar5);
				icon.raw.style.setProperty("--fa-bounce-jump-scale-y", icon.animation.scalar6);
				icon.raw.style.setProperty("--fa-bounce-land-scale-x", icon.animation.scalar7);
				icon.raw.style.setProperty("--fa-bounce-land-scale-y", icon.animation.scalar8);
			}	break;

			case IconAnimation.TYPE_PULSE: {
				icon.raw.style.setProperty("--fa-beat-fade-opacity", icon.animation.scalar1);
				icon.raw.style.setProperty("--fa-beat-fade-scale", icon.animation.scalar2);
			}	break;

			case IconAnimation.TYPE_ROTATE: {
				icon.raw.style.setProperty("--fa-flip-x", icon.animation.scalar1);
				icon.raw.style.setProperty("--fa-flip-y", icon.animation.scalar2);
				icon.raw.style.setProperty("--fa-flip-z", icon.animation.scalar3);
				icon.raw.style.setProperty("--fa-flip-angle", icon.animation.scalar4);
			}	break;

			case IconAnimation.TYPE_SHAKE: {
				if(icon.animation.scalar1 === 1) {
					icon.raw.classList.add(IconAnimation.TYPE_SHAKE);
				}					

				else {
					icon.raw.classList.remove(IconAnimation.TYPE_SHAKE);
				}
			}	break;

			case IconAnimation.TYPE_SPIN: {
				if(icon.animation.scalar1 === 1) {
					icon.animation.controller?.onAnimationStart.call();
				}

				if(icon.animation.progressive === true) {
					icon.raw.classList.remove(IconAnimation.TYPE_SPIN);
					icon.raw.classList.add("fa-spin-pulse");
				}

				if(icon.animation.scalar1 === 0) {
					icon.raw.classList.remove(IconAnimation.TYPE_SPIN);
					icon.raw.classList.remove("fa-spin-pulse");
					icon.raw.classList.remove("fa-spin-reverse");
					icon.animation.controller?.onAnimationEnd.call();
				}

				if(icon.animation.direction === "reverse") {
					icon.raw.classList.add("fa-spin-reverse");
				}
			}	break;

			default: {
				console.error(`The animation type ${icon.animation.type} is not recognized by this version of Buzz.`);
			}	break;
		}
	}
}

/**
 * 
 * @param {Icon} icon 
 */
function createIconElement(icon) {
	icon.raw = document.createElement("i");
	icon.raw.id = icon.key; 

	// If this is not a spin animation...
	if(icon.animation && icon.animation.type !== IconAnimation.TYPE_SPIN) {

		// Now, let's call the animation end function.
		icon.raw.addEventListener("animationend", (_) => {
			icon.animation?.controller.onAnimationEnd?.call(); // Call the animation end function.				
		});

		// This is animation start callback. This fails because... dammit.
		icon.raw.addEventListener("animationstart", (_) => {
			icon.animation?.controller.onAnimationStart.call();
		});
	}
}

class Icon extends StatelessWidget {

	/**
	 * This is the animation to bind to this icon specifically.
	 *
	 * @type {IconAnimation}
	 */
	animation;


	/**
	 * The specific icon inside this icon file.
	 *
	 * @param {string} value
	 */
	data;

	/**
	 * The color of this icon.
	 * @param {string}
	 */
	color;

	// This is the constructor of the icon itself that is to be rendered to the screen.
	constructor(data, {
		size 		=	'1em', // This defaults to the device size for one character on screen.
		animation	= 	undefined, // This is not defined because we do not really need this animation to move by default.
		color 		=	globalThis.buzzContext.theme.secondaryColor, // This defaults to the secondary color of your app.
		margin		=   InsetsGeometry.zero,
		padding		=	InsetsGeometry.zero
	} = {}) {
		super();

		// Bind the fields to this lad.
		this.data = data;
		this.size = size;
		this.color = color;
		this.animation = animation;
		this.margin = margin;
		this.padding = padding;

		// Next, we create the HTML element.
		createIconElement(this);
	}

	render(parent) {
		super.render(parent); // First, call the super function.

		// Style the icon
		styleIcon(this);

		// Now this is mounted and we can return it.
		this.mounted = true;
		return this;
	}

	postRender(context) {
		super.postRender(context);
	}

	update({
		data = this.data,
		color = this.color
	} = {}) {
		if(data === this.data && color ===this.color) {
			return; // If nothing has changed, why bother?
		}

		// Update this information.
		this.data = data;
		this.color = color;

		// Create a new element for this icon.
		createIconElement(this);

		// Then style this element.
		styleIcon(this);

		// Just replace this directly.
		document.getElementById(this.key).replaceWith(this.raw);
	}
}

export {
	Icon,
	IconAnimation
}
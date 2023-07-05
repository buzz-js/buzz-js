import { StatelessWidget} from '../framework/widget.js';
import { NativeStyleElement } from '../style/native.js';
import { AnimationController } from '../animation/anim.js';

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

class Icon extends StatelessWidget {
	/**
	 * The specific icon inside this icon file.
	 *
	 * @type {string}
	 */
	data;

	/**
	 * This is the animation to bind to this icon specifically.
	 *
	 * @type {IconAnimation}
	 */
	animation;

	// This is the constructor of the icon itself that is to be rendered to the screen.
	constructor(data, {
		size 		=	'1em', // This defaults to the device size for one character on screen.
		animation	= 	undefined, // This is not defined because we do not really need this animation to move by default.
		color 		=	globalThis.buzzContext.theme.secondaryColor, // This defaults to the secondary color of your app.
	} = {}) {
		super();

		// Bind the fields to this lad.
		this.data = data;
		this.size = size;
		this.color = color;
		this.animation = animation;

		// Next, we create the HTML element.
		this.raw = document.createElement("i");
		this.raw.id = this.key; 
	}

	render(parent) {
		super.render(parent); // First, call the super function.

		// Now, we split this icon to different small groups.
		let classes = this.data.split(' ');

		// First order of events is to add this to the class list.
		classes.forEach(element => {
			this.raw.classList.add(element);
		});

		// Next, bind the styling.
		this.raw.style.color = this.color;
		this.raw.style.fontSize = this.size;

		if(this.animation && this.animation instanceof IconAnimation) { // If this animation is actually useful.
			// First, we set the attributes that remain fairly constant throughout the versions.
			this.raw.style.setProperty("--fa-animation-duration", this.animation.duration);
			this.raw.style.setProperty('--fa-animation-delay',	this.animation.delay);
			this.raw.style.setProperty("--fa-animation-timing", this.animation.timing);
			this.raw.style.setProperty("--fa-animation-iteration-count", this.animation.iterations);
			this.raw.style.setProperty("--fa-animation-direction", this.animation.direction);

			// Next, assign the class value to this animation.
			this.raw.classList.add(this.animation.type);

			// Finally, it is time to handle the icon animation customization.
			switch(this.animation.type) {
				case IconAnimation.TYPE_BEAT: {
					this.raw.style.setProperty("--fa-beat-scale", this.animation.scalar1);
				}	break;

				case IconAnimation.TYPE_BOUNCE: {
					this.raw.style.setProperty("--fa-bounce-rebound", this.animation.scalar1);
					this.raw.style.setProperty("--fa-bounce-height", this.animation.scalar2);
					this.raw.style.setProperty("--fa-bounce-start-scale-x", this.animation.scalar3);
					this.raw.style.setProperty("--fa-bounce-start-scale-y", this.animation.scalar4);
					this.raw.style.setProperty("--fa-bounce-jump-scale-x", this.animation.scalar5);
					this.raw.style.setProperty("--fa-bounce-jump-scale-y", this.animation.scalar6);
					this.raw.style.setProperty("--fa-bounce-land-scale-x", this.animation.scalar7);
					this.raw.style.setProperty("--fa-bounce-land-scale-y", this.animation.scalar8);
				}	break;

				case IconAnimation.TYPE_PULSE: {
					this.raw.style.setProperty("--fa-beat-fade-opacity", this.animation.scalar1);
					this.raw.style.setProperty("--fa-beat-fade-scale", this.animation.scalar2);
				}	break;

				case IconAnimation.TYPE_ROTATE: {
					this.raw.style.setProperty("--fa-flip-x", this.animation.scalar1);
					this.raw.style.setProperty("--fa-flip-y", this.animation.scalar2);
					this.raw.style.setProperty("--fa-flip-z", this.animation.scalar3);
					this.raw.style.setProperty("--fa-flip-angle", this.animation.scalar4);
				}	break;

				case IconAnimation.TYPE_SHAKE: {
					if(this.animation.scalar1 === 1) {
						this.raw.classList.add(IconAnimation.TYPE_SHAKE);
					}					

					else {
						this.raw.classList.remove(IconAnimation.TYPE_SHAKE);
					}
				}	break;

				case IconAnimation.TYPE_SPIN: {
					if(this.animation.scalar1 === 1) {
						this.animation.controller?.onAnimationStart.call();
					}

					if(this.animation.progressive === true) {
						this.raw.classList.remove(IconAnimation.TYPE_SPIN);
						this.raw.classList.add("fa-spin-pulse");
					}

					if(this.animation.scalar1 === 0) {
						this.raw.classList.remove(IconAnimation.TYPE_SPIN);
						this.raw.classList.remove("fa-spin-pulse");
						this.raw.classList.remove("fa-spin-reverse");
						this.animation.controller?.onAnimationEnd.call();
					}

					if(this.animation.direction === "reverse") {
						this.raw.classList.add("fa-spin-reverse");
					}
				}	break;

				default: {
					console.error(`The animation type ${this.animation.type} is not recognized by this version of Buzz.`);
				}	break;
			}
		} 

		// Now this is mounted and we can return it.
		this.mounted = true;
		return this;
	}

	postRender(context) {
		super.postRender(context);

		if(this.animation.type !== IconAnimation.TYPE_SPIN) {
			const icon = this;

			// Now, let's call the animation end function.
			this.raw.addEventListener("animationend", (_) => {
				icon.animation?.controller.onAnimationEnd.call(); // Call the animation end function.				
			});

			// This is animation start callback. This fails because... dammit.
			this.raw.addEventListener("animationstart", (_) => {
				icon.animation?.controller.onAnimationStart.call();
			});
		}
	}
}

export {
	Icon,
	IconAnimation
}
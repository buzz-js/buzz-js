import { panic } from '../framework/utilities.js';

let checkRaw = function(controller) {
    if(!controller.raw || !controller.raw.mounted) {
        panic("Attempted to use an animation controller on a widget that is no longer mounted.");
    }
}

class AnimationController {
    /**
     * A callback made after an animation has ended.
     *
     * @type {function()}
     */
    onAnimationEnd;

    /**
     * A callback made before the animation is fired.
     *
     * @type {function()}
     */
    onAnimationStart;

    constructor({
        onAnimationStart = () => {},
        onAnimationEnd = () => {},
    }   = {}) {
        /**
         * @type {Widget}
         */
        this.raw = undefined;
        this.onAnimationStart = onAnimationStart;
        this.onAnimationEnd = onAnimationEnd;
    }

    /**
     * Used to force an animation to start.
     */
    start() {
        checkRaw();

        this.raw.raw.getAnimations().forEach(anim => {
            anim.start();
        });
    }

    /**
     * Used to force an animation to pause.
     */
    pause() {
        checkRaw();

        this.raw.raw.getAnimations().forEach(anim => {
            anim.start();
        });
    }

    /**
     * Used to force an animation to stop.
     */
    stop() {
        checkRaw();

        this.raw.raw.getAnimations().forEach(anim => {
            anim.start();
        });
    }
}

export {
    AnimationController
}
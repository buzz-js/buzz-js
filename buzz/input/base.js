import { StatefulWidget } from "../framework/state.js";

/**
 * ## General
 *
 * This class represents the controller for all mutable input types. You see when I say
 * mutable, I mean that the value of the InputWidget can change. Kind of like how the
 * contents of a TextInput Widget would change each time you hit the keyboard or a 
 * DropDownMenu would change each time you select something else from the menu.
 */
export class InputController {
	/**
	 * A function called when the value of an InputWidget is being changed on the fly.
	 * You see, this was added just to make validation easier. No reason really else.
	 * The only parameter of this function is the current value of the InputWidget that
	 * is in fact the owner of this InputController. 
	 *
	 * @type {function(any)}
	 */
	onValueChanged;

	/**
	 * This is a function called when the input widget has detected that we have finished
	 * changing its value. This should be used to perform closing validation on a Widget
	 * after retrieving its final value.
	 * 
	 * ### Usage
	 * It has 2 parameters included in the callback. The first one is the current value of
	 * the InputWidget and the second one is the previous value. If such a thing does exist.
	 *
	 * @type {function(any, any)}
	 */
	onValueCompleted;

	/**
	 * This callback is made when the value of an InputWidget just started getting edited
	 * in real time. This should be treated as a sort of `'OnInteractionStart'` function 
	 * because it is used as a kind of means of knowing **_when exactly the user has started
	 * making input_**
	 *
	 * ### Usage
	 * It's parameter might vary from InputWidget to InputWidget so read the docs separately
	 * for each one.
	 * @type {function(any)}
	 */
	onValueStarted;

	/**
	 * All Input widgets are StatefulWidgets that MUST have reactive controllers. Typically,
	 * they are meant to manage state reactively since that is most efficient way of doing
	 * so. You see, this function is called 
	 * 
	 * ### Usage
	 * This has 3 parameters which in order are
	 * - The reference to the InputWidget that owns this InputController.
	 * - The previous value of the state of the controller. What the state of the controller
	 * changed from before it reacted.
	 * - The current value of the state of the controller. The value that the controller is
	 * reacting to.
	 * @type {function(StatefulWidget, any, any)}
	 */
	onReactState;


	constructor({
		onValueChanged = undefined,
		onValueCompleted = undefined,
		onValueStarted = undefined,
		onReactState = undefined,
	} = {}) {
		this.onValueChanged     = onValueChanged;
		this.onValueCompleted    = onValueCompleted;
		this.onValueStarted      = onValueStarted;
		this.onReactState       = onReactState;
	}
}

/**
 * ## General
 * Any Widget that has a value that can be changed with user input that is not a button.
 * A good example would be the [TextInput](./text.js) Widget. It is a Widget that expects
 * to receive data from the user on keystrokes from the keyboard. Its value constantly be
 * changing.
 * 
 * ### Usage
 * All `InputWidget` instances are expected to be bound to an `InputController` if you 
 * wish to do anything really useful with them. The `InputController` bound to an 
 * `InputWidget` would listen to changes in the Widget's contents and react with the right
 * callback for each change.
 * 
 * How this happens would be different for each Widget so it is advised that you read the
 * individual documentations of the [RadioInput](./radio.js), [DropDownInput](./menu.js),
 * [TextInput](./text.js), and so on.
 * 
 * 
 * @see [RadioInput](./radio.js) 
 * @see [DropDownInput](./menu.js)
 * @see [TextInput](./text.js)
 */
export class InputWidget extends StatefulWidget {
	/**
	 * The input controller associated with this InputWidget
	 */
	inputController;

	constructor(stateController, controller = undefined) {
		super(stateController);
		
        // If this controller is set.
        if(controller) {
            controller.widget = this;
        }

        // Assign this controller to this TextInput widget.
        this.inputController = controller;
	}

	onStateChanged(previous, current) {
		super.onStateChanged(previous, current);

		// If there was really no change at all...
		if(previous === current) {
			return; // Do not do anything.
		}

        // If the input and state controllers are bound...
        if(this.controller && this.inputController && this.inputController.onReactState) {
            // React to the change in state. Pronto.
			this.inputController.onReactState(this, previous, current);
        }
	}
}
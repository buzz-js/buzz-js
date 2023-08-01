# About 
Buzz.js is a JavaScript development framework with its primary focus on front-end development.It is written in Vanilla JS so it has no dependencies on any external packages.

# Design Philosophy 
By design, all components in Buzz are separated into two groups — StatelessWidgets and StatefulWidgets. Before we talk about these two components, let's talk about the common ground they share which is their lifecycle functions. In Buzz.js, all components have five (5) functions that get invoked by the framework when different events happen: `beforeRender(AppContext)`, `postRender(AppContext)`, `unmount(AppContext)`, `render(Widget)`, and `remove(AppContext)`.

Now, if you've worked with [Flutter](https://flutter.dev), you'd immediately realize that the design philosophy of Buzz is heavily similar to that of Flutter. Yes, it was intentional. Flutter is such a nice framework to work with, at least in my own opinion, but writing web apps in Flutter, was a performance headache — at the time of writing this documentation. You would need to actively take extra steps to make your web-app performant and those extra steps are a bit daunting to people who are new to the optimization of software or even development altogether. I wrote Buzz because I wanted to make a UI development framework that follows the same design principles with Flutter but was written with focus on web-app development. I then told this idea to a couple of friends of mine and then we became the primary maintainers of the Buzz source tree. We're still open to more people joining us though so, if you don't mind, you could always hit us up on our socials or talk about contributing in the discussions.

# Working with Buzz
Now that I've given exposition to the philosophy of design, let's dive in to working with Buzz. Before we talk about the the types of components the framework features, let's talk about the rules of thumb that each component must follow to be rendered properly on screen.

All logic of initialization that would be necessary to simply render and/or manage your widget the right way should be put inside the `constructor`. The constructor should never be bulky because it might get called very frequently depending on how frequently the ***state of its parent widget is invalidated***.

If you want to do any time consuming stuff, there is an asynchronous function `beforeRender(AppContext)` that is called right before the widget is built **AND NOT RENDERED**. The framework does not and would never wait on you for the function to be completed before moving forward with rendering. That would just result in awkward user experience since there'd be a lot of blank screens. This function is called every time before the widget is rendered or updated to the viewport. Meaning, you should take that into account to avoid repeating your initializations needlessly. If you have something that you would like to do only once before a Widget is built, you're better off putting it in the constructor as long as you abide by the rules inside the previous paragraph.

The `postRender(AppContext)` function is called when your widget has been added to the render tree and but hasn't yet been drawn. This is useful for operations that you would logically like to perform after your widget has been added to the render tree. Like, initializing any timers and binding any event listeners. This function is also asynchronous by design and is not waited upon so that rendering is not ***blocked***.

There is the `unmount(AppContext)` function that is called when your widget is no longer visible and is about to be de-allocated. This function should handle all things cleanup. You see, this function should return `true` or `false` value which would be used by the framework to know if it can call the remove function. The `unmount` function by design is supposed to be used for preparing your Widget for the cleanup that would be performed in the remove function. If your implementation of the unmount function returns false, you are telling the framework not to bother calling the `remove` function.

The `render(Widget)` function is the most important one. It is passes what to render to the framework. It is what would be invoked by the framework to paint your widget. The return value of any Widget that is navigable, in the sense that it represents a route, should be a `PageView` widget which means that it is treated like a ***single page*** by the framework. The framework would scream an error at you if you don't do that. I know, the framework is cranky sometimes and I really wonder... why?

Enough said, so let me show you a practical example.
```js
import { InsetsGeometry } from "../buzz/style/insets.js";
import { PageView } from "../buzz/page/base.js";
import { Text, TextStyle } from "../buzz/text/text.js";
import { StatelessWidget }  from '../buzz/framework/widget.js';

class HomePage extends StatelessWidget {
	constructor() {
		super();
	}

	beforeRender(context) {
		super.beforeRender(context);
		console.log("Before we rendered, it was.")
	}

	postRender(context) {
		super.postRender(context);
		console.log("After we rendered, it shall be — and it is — a potato(🥔).");
	}

	render(parent) {
		super.render(parent);

		console.log("When we rendered, it is.");

		return new PageView({
			body: new Text(
				"🥔", {
					margin: InsetsGeometry.only({bottom: '2.5em'}),
					fontSize: '2em',
					style: new TextStyle({
						fontColor: 'black',
						fontWeight: 'bolder',
					})
				}
			)
		});
	}
}

export {
	HomePage
}
```
The example with questionable taste creates a web page with a single text element of magnificent size. That... shows... a potato. Argh! Well, on the bright side, that was just to get you familiar with the Buzz SDK. As an much welcome activity, you can try changing the contents of the [Text](https://github.com/buzz-js/buzz-sdk/blob/stable/text/text.js) widget to something more practical and in better taste. You might have noticed but the example above has something that we have not yet talked about which is a `StatelessWidget`. That... is a decent segway to our next topic.


## Stateless Components
Stateless widgets are the static components. Components that would spend their lifetimes without being updated — they do not depend on data, either from a remote location or the codebase, when rendering. Meaning, whenever they are drawn, there is really no expectation that they should change therefore, by design, you cannot change them.

To create a stateless component, you create a class that extends the [StatelessWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/widget.js) class. All components that extend this super-class, either as a part of the framework or as a part of your web app, are static and unchanging. However, some library widgets like the [Text](https://github.com/buzz-js/buzz-sdk/blob/stable/text/text.js) component, which has a setter function `value`, bypass this behavior and use simpler methods to manage the state of their contents. This was done because of practicality as during the course of running a program, many times, you would desire to change text in a given area on screen, or the image displayed in a component and you should not have to update the state of any widget to do that. That adds an unnecessary amount of overhead to the management of state for such otherwise simple tasks. Your hand-written components that go in your own web-app however cannot override this behavior. For your use cases, you are probably better off using a stateful component with a reactive state controller.

## Stateful Components
In Buzz, all stateful components are dynamic. Meaning, when a component is stateful, it can be updated in the RenderTree when something it depends on is changed. To make a stateful component, similarly to the creation of a stateless component, you must create a class that inherits from the [StatefulWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) class. The stateful components in Buzz were made with a ***complex state philosophy*** so to update the state of any stateful component, you are required to bind a [StateController](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) to the component. By default a new state controller is bound to every stateful component upon creation but the kind that is bound is an adaptive state controller.

> #### I know I said stateful components in Buzz were made with a ***complex state philosophy*** but that is just really kind of misdirecting. What I really meant was that ***the state management is not tied to one philosophy*** so you can pick the most efficient choice on a component-level basis. There are 2 options however: ***adaptive state management*** and ***reactive state management***.

### Reactive State Management
Reactive state management is the lighter weight choice and is typically the more efficient one too. To manage state reactively, not only must the [StateController](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) bound to the [StatefulWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) be reactive, but the class is also required to override the `onStateChanged(previous: any, current: any)` method. If you could already guess, the ***state*** of the reactive stateful component is treated like a variable in the state controller and each time this variable changes, the `onStateChanged(previous: any, current: any)` function is invoked. The previous state is passed as the first parameter, and the updated state is passed as the second parameter.

For our first example, with a StatefulWidget as the base class, let's make a Buzz web app that _shows the user how many times he or she has clicked a [TextButton](https://github.com/buzz-js/buzz-sdk/blob/stable/input/button/text.js) using reactive state management_ TextButton,
```js
import { InsetsGeometry } from "../buzz/style/insets.js";
import { Text, TextStyle } from "../buzz/text/text.js";
import { StatefulWidget, StateController }  from '../buzz/framework/state.js';
import { ScrollableContainer, ScrollController } from "../buzz/scroll/scrollview.js";
import { ContainerStyle } from "../buzz/framework/container.js";
import { Alignment } from "../buzz/alignment/alignment.js";
import { Column } from "../buzz/flex/column.js";
import { TextButton, TextButtonStyle } from "../buzz/input/button/text.js"
import { PageView } from "../buzz/page/base.js";

class HomePage extends StatefulWidget {
	// The text widget we use to show the user how many times he or she has clicked the button.
	counterText = new Text(
		"You have clicked 0 times", {
			margin: InsetsGeometry.only({bottom: '2.5em'}),
			fontSize: '2em',
			style: new TextStyle({
				fontColor: 'black',
				fontWeight: 'bolder',
			})
		}
	);

	constructor() {
		const controller = new StateController({
			// The initial count is 0
			initial: 0,
			
			// This is a reactive state controller.
			reactive: true
		});
		super(controller)
	}

	onStateChanged(previous, current) {
		super.onStateChanged(previous, current);

		// Tell the user how many times he or she has clicked
		this.counterText.value = "You have clicked " + current + " times";
	}

	incrementCounter() {
		// Increment the value by 1.
		this.controller.state += 1;
	}

	render(parent) {
		super.render(parent);
		
		// All root pages must return a PageView in Buzz
		return new PageView({
			body: new ScrollableContainer({
				controller: new ScrollController(true, false),
				style: new ContainerStyle({
					alignment: Alignment.topCenter // Align this view to the center.
				}),
				child: new Column({
					children: [
						// Add the counter text.
						this.counterText,

						// After the title of the page.
						new TextButton(
							"Increment Count", {
							margin: InsetsGeometry.only({bottom: '2em'}),
							style: new TextButtonStyle({
								fontSize: '1.2em',
								padding: new InsetsGeometry().setVertical('0.8em').setHorizontal('2.8em'),
							}),
							onClick: () => this.incrementCounter()
						}),
					]
				}),
			})
		});
	}
}

export {
	HomePage,
}
```

Now, we declare `counterText` as a field inside the `HomePage` class we built that extends [StatefulWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js). Inside the constructor, we build a new [StateController](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) aptly named `controller` and pass it to the ***super*** constructor so that it would bind it as the state controller of the ***instance of `HomePage` that the framework would spawn behind the scenes***. In the `render(Widget)` function, we can then see that we add `counterText` to the **widget tree** that would be rendered on screen for the user to see. Inside the [TextButton's](https://github.com/buzz-js/buzz-sdk/blob/stable/input/button/text.js) `onClick` function, we invoke the `incrementCounter` function for the ***instance of `HomePage` that the framework spawned*** which would increment the value of the state of the [StateController](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) bound to it by 1. Doing this in turn would invoke the `onStateChanged(previous, current)` function on the ***instance of `HomePage` that the framework spawned*** which would update the value of the text in `counterText` to correctly say how many times the button has been clicked.

For our second — and more advanced — example, let's look at a single web page that contains a password text field that changes color and icon whenever the user clicks on the password visibility button.
```js
import { InsetsGeometry } from "../buzz/style/insets.js";
import { Text, TextStyle } from "../buzz/text/text.js";
import { StateController }  from '../buzz/framework/state.js';
import { StatelessWidget }  from '../buzz/framework/widget.js';
import { ScrollableContainer, ScrollController } from "../buzz/scroll/scrollview.js";
import { ContainerStyle } from "../buzz/framework/container.js";
import { Alignment } from "../buzz/alignment/alignment.js";
import { Column } from "../buzz/flex/column.js";
import { Icon } from '../buzz/icon/icon.js';
import { SolidIcons } from '../buzz/icon/data.js';
import { IconButton } from '../buzz/input/button/icon.js'; 
import { TextButton, TextButtonStyle } from "../buzz/input/button/text.js"
import { TextInput, TextInputController, TextInputType } from "../buzz/input/text.js";
import { PageView } from "../buzz/page/base.js";

class LoginPage extends StatelessWidget {
	/// The input controller for the value of the email.
	emailText = new TextInputController();

	/// The input controller for the value of the password.
	passwordText = new TextInputController({
		/**
		 * @param {TextInput} icon Something
		 */
		onReactState: (widget, _, current) => {
			// Now, each time this gets changed, we want to change the color and the active
			// icon you see there. This is too round about of a method to do this but its kind
			// of because of the way JS + SVG icon fonts work. 
			widget.endIcon.icon.update({
				data: current ? SolidIcons.eyeSlash : SolidIcons.eye,
				color: current ? 'black' : 'red' 
			});

			// We also want to change the text type from password to something else.
			widget.inputController.setTextType(current ? TextInputType.password : TextInputType.passwordVisible);
		}
	});

	/// The controller for the visibility of the password.
	passwordVisibilityController = new StateController({
		initial: true, 
		reactive: true
	});

	onButtonClick() {
		// Yeah, just change the state of the controller.
		this.passwordVisibilityController.state = !this.passwordVisibilityController.state;
	}

	render(parent) {
		super.render(parent);

		return new PageView({
			body: new ScrollableContainer({
				controller: new ScrollController(true, false),
				style: new ContainerStyle({
					alignment: Alignment.topCenter // Align this view to the center.
				}),
				child: new Column({
					children: [
						new Text(
							"Login to your account", {
								margin: InsetsGeometry.only({bottom: '2.5em'}),
								fontSize: '2em',
								style: new TextStyle({
									fontColor: 'black',
									fontWeight: 'bolder',
								})
							}
						),
	
						new TextInput(this.emailText, {
							margin: InsetsGeometry.only({bottom: '0.5em'}),
							hint: "Enter your email address",
							type: TextInputType.email,
							startIcon: new Icon(
								SolidIcons.circleUser, {
									margin: InsetsGeometry.only({right: '10px'}),
									size: '24px'
								}
							),
						}),
	
						new TextInput(this.passwordText, {
							controller: this.passwordVisibilityController,
							margin: InsetsGeometry.only({bottom: '5em'}),
							hint: "Enter your password",
							type: TextInputType.password,
							startIcon: new Icon(
								SolidIcons.anchorSecure, {
									margin: InsetsGeometry.only({right: '10px'}),
									size: '24px'
								}
							),
	
							endIcon: new IconButton(
							new Icon(
								SolidIcons.eyeSlash, {
									color: 'black',
								}
							), {
								onClick: () => this.onButtonClick(),
							})
						}),
						
						// After the title of the page.
						new TextButton(
							"Log In", {
							margin: InsetsGeometry.only({bottom: '2em'}),
							style: new TextButtonStyle({
								fontSize: '1.2em',
								padding: new InsetsGeometry().setVertical('0.8em').setHorizontal('2.8em'),
							}),
							onClick: () => alert("Log in?")
						}),
					]
				}),
			})
		});
	}
}

export {
	LoginPage as HomePage
}
```

The example above is actually an excerpt from the original example application in the [test](./test/) directory with some modifications. When you run this excerpt from a Buzz project directory, you would immediately notice that when you click on the eye icon on the right of the password input text field, you would notice that the color and icon there in changes. This is most effective demonstration of reactive state management in Buzz. The [TextInputController](https://github.com/buzz-js/buzz-sdk/blob/stable/input/text.js) is used by the `onButtonClick()` function to set the state of the password text field by inverting the value from `true` to `false` and vice-versa.

Let us take 2 steps back. What makes this possible is that the [TextInput](https://github.com/buzz-js/buzz-sdk/blob/stable/input/text.js) is much like the [InputWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/input/base.js) class it extends. In the sense that all instances are required to have a [StateController](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) bound to them and this state controller must be reactive. Input widgets are expected to only change state when ***reacting to user interaction*** and not have complicated states that would require ***invalidation*** to transition to another state. Meaning, the entire widget is not expected to be rebuilt just because of user interaction. The [TextButton](https://github.com/buzz-js/buzz-sdk/blob/stable/input/button/text.js) widget calls the `onButtonClick` function which would toggle the state of the `passwordVisibilityController`, and each time the state of the password visibility controller is changed, the `onReactState(widget, previous, current)` function is invoked with the 
[TextInput](https://github.com/buzz-js/buzz-sdk/blob/stable/input/text.js) as the first argument, a previous state as the second argument, and the current state is the third argument. Then inside the `onReactState(widget, previous, current)` function for the [TextInputController](https://github.com/buzz-js/buzz-sdk/blob/stable/input/text.js)  `passwordText` is then set up to change the icon and color depending on the value of current.

A good question you're probably asking is "what does any of this have to do with the onStateChanged function?" Well, you see, under the hood, all calls to `onReactState(widget, previous, current)` would invoke the `widget.onStateChanged(previous, current)` method when the [InputWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/input/base.js) is a [StatefulWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js). When it however is not, some default implementation would be used.

One thing to note is that the `initial` state of any [StateController](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) does not update a stateful component but only serves to assign a value to the initial state of the stateful component's controller. This is because it is wasteful to render the widget one more time just to assign an initial state. Therefore, you'd have to take this into consideration when creating your [StatefulWidget](https://github.com/buzz-js/buzz-sdk/blob/stable/framework/state.js) and make sure that the `initial` state is always set to the correct value ­— especially if the next value depends on the previous one like in our example above.

To close this off, by design, you are expected to use ***reactive state management*** when the stateful component in question has a finite number of defined and known states. That's long talk for _use it when the current state of the component can be efficiently stored and represented in a variable_.
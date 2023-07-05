import { Border } from "../buzz/style/border.js";
import { Colors } from "../buzz/style/color.js";
import { InsetsGeometry, RadialGeometry } from "../buzz/style/insets.js";
import { Text, TextStyle } from "../buzz/text/text.js";
import { StatefulWidget, StateController }  from '../buzz/framework/state.js';
import { ScrollableContainer, ScrollController } from "../buzz/scroll/scrollview.js";
import { ContainerStyle } from "../buzz/framework/container.js";
import { Alignment } from "../buzz/alignment/alignment.js";
import { Column } from "../buzz/flex/column.js";
import { SizedBox } from '../buzz/box/sized.js';
import { ImageFit, ImageGeometry, ImageStyle, ImageView } from "../buzz/image/image.js";

class HomePage extends StatefulWidget {
	/**
	 * This means that the state of the Widget has already been invalidated once. We do this to avoid infinite recursion.
	 * @type {boolean}
	 */
	handled;

	/**
	 * We use this to calculate the total amount of time that was required to render the Widget in question.
	 */
	renderDuration;
	static textValue = "This should stay on your screen for exactly 2 seconds.";

	constructor() {
		super(new StateController());
	}

	beforeRender(context) {
		// First, record the timestamp from before this was rendered.
		this.renderDuration = (new Date().getTime());
	}

	async postRender(context) {
		super.postRender(context);

		// After the rendering is complete, record the timestamp of how long it took.
		this.renderDuration = new Date().getTime() - this.renderDuration;

		// Log how much time was taken to render this Widget.
		console.log("Rendered in " + this.renderDuration + " millisecond(s)");

		// Do nothing.
		if(!this.handled) {
			// Set this first before we invalidate the current state.
			this.handled = true;

			// Now we can invalidate this widget
			setTimeout((timer) => {
				this.controller.invalidate(function() {
					// Change the value of this Text widget to what you should end up seeing on the screen.
					HomePage.textValue = "Hello World, from a Text widget in Buzz.js!";
				});
			}, 2000);
		}
	}

	render(parent) {
		// First, invoke this function.
		super.render(parent);

		// Return the Widget.
		return new ScrollableContainer({
			controller: new ScrollController(true, false),
			style: new ContainerStyle({
				alignment: Alignment.topCenter // Align ths view to the center.
			}),
			child: new Column({
				children: [
					new Text(
						HomePage.textValue, {
							style: new TextStyle({
								color: Colors.black,
								overflowType: TextStyle.OVERFLOW_ELLIPSIS,
								border: new Border({
									lineWidth: '2px',
									lineType: Border.LINE_SOLID,
									color: Colors.black
								}),
								borderRadius: RadialGeometry.all('10px')
							}),
							padding: InsetsGeometry.only({
								top: '5px', 
								left: '10px', 
								bottom: '5px',
								right: '10px'
							}),
						}
					),

					new SizedBox({
						height: '10px'
					}),

					new Text(
						HomePage.textValue, {
							style: new TextStyle({
								color: Colors.black,
								overflowType: TextStyle.OVERFLOW_ELLIPSIS,
								border: new Border({
									lineWidth: '2px',
									lineType: Border.LINE_SOLID,
									color: Colors.black
								}),
								borderRadius: RadialGeometry.all('10px')
							}),
							padding: InsetsGeometry.only({
								top: '5px',
								left: '10px',
								bottom: '5px',
								right: '10px'
							}),
						}
					),

					new SizedBox({
						height: '10px'
					}),

					new ImageView(
						"res/image.jpg", {
						imageStyle: new ImageStyle({
							height: '200px',
							width: '200px',
							shape: ImageGeometry.geometryCircular,
							fit: ImageFit.cover,
						})
					})
				]
			})
		});
	}
}

export {
	HomePage,
}

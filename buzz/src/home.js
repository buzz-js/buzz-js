import { InsetsGeometry } from "../buzz/style/insets.js";
import { Text, TextStyle } from "../buzz/text/text.js";
import { StatefulWidget, StateController }  from '../buzz/framework/state.js';
import { ScrollableContainer, ScrollController } from "../buzz/scroll/scrollview.js";
import { ContainerStyle } from "../buzz/framework/container.js";
import { Alignment } from "../buzz/alignment/alignment.js";
import { Column } from "../buzz/flex/column.js";
import { Row } from "../buzz/flex/row.js";
import { Icon } from '../buzz/icon/icon.js';
import { ActionController } from '../buzz/input/button/action.js';
import { SolidIcons } from '../buzz/icon/data.js';
import { IconButton } from '../buzz/input/button/icon.js'; 
import { ImageFit, ImageGeometry, ImageStyle, ImageView } from "../buzz/image/image.js";
import { TextButton, TextButtonStyle } from "../buzz/input/button/text.js"
import { TextInput, TextInputController, TextInputType } from "../buzz/input/text.js";
import { PageView } from "../buzz/page/base.js";

class HomePage extends StatefulWidget {
	emailText = new TextInputController();
	passwordText = new TextInputController({
		/**
		 * @param {TextInput} icon Something
		 */
		onReactState: (icon, _, current) => {
			// Now, each time this gets changed, we want to change the color and the active
			// icon you see there. This is too round about of a method to do this but its kind
			// of because of the way JS + SVG icon fonts work. 
			icon.endIcon.icon.update({
				data: current ? SolidIcons.eyeSlash : SolidIcons.eye,
				color: current ? 'black' : 'red' 
			});

			// We also want to change the text type from password to something else.
			icon.inputController.setTextType(current ? TextInputType.password : TextInputType.passwordVisible);
		}
	});

	// This is the way the controller works.
	passwordController = new StateController({
		initial: true, 
		reactive: true
	});

	constructor() {
		const stateController = new StateController();
		super(stateController);
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
	
						new ImageView(
							"res/image.jpg", {
								margin: InsetsGeometry.only({bottom: '6em'}),
								style: new ImageStyle({
									height: '13em',
									width: '13em',
									fit: ImageFit.cover,
									shape: ImageGeometry.geometryCircular
								}),
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
							controller: this.passwordController,
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
								onClick: () => {
									// Yeah, just change the state of the controller.
									this.passwordController.state = !this.passwordController.state;
								},
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
	
						// Now for the registration link...
						new Row({
							margin: InsetsGeometry.only({bottom: '4em'}),
							children: [
								new Text(
									"Don't have an account?", {
										padding: InsetsGeometry.only({right: '0.5em'}),
										fontSize: '0.9em',
										style: new TextStyle({
											fontColor: 'black',
											fontWeight: 'bolder',
										})
									}
								),
	
								new ActionController(
									new Text(
										"Register Now.", {
											padding: InsetsGeometry.zero,
											fontSize: '0.9em',
											style: new TextStyle({
												fontColor: 'yellow',
												fontWeight: 'bolder',
											})
										}
									), {
									onClick: () => {
										alert("Register User...")
									},
								})
							]}
						),
					]
				}),
			})
		})
	}
}

export {
	HomePage,
}

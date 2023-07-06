import { Border } from "../buzz/style/border.js";
import { InsetsGeometry, RadialGeometry } from "../buzz/style/insets.js";
import { Text, TextStyle } from "../buzz/text/text.js";
import { StatefulWidget, StateController }  from '../buzz/framework/state.js';
import { ScrollableContainer, ScrollController } from "../buzz/scroll/scrollview.js";
import { ContainerStyle } from "../buzz/framework/container.js";
import { Alignment } from "../buzz/alignment/alignment.js";
import { Column } from "../buzz/flex/column.js";
import { Row } from "../buzz/flex/row.js";
import { Icon } from '../buzz/icon/icon.js';
import { ActionController } from '../buzz/boundary/interact.js';
import { RegularIcons, SolidIcons } from '../buzz/icon/data.js';
import { IconButton } from '../buzz/button/icon.js'; 
import { ImageFit, ImageGeometry, ImageStyle, ImageView } from "../buzz/image/image.js";
import { TextButton, TextButtonStyle } from "../buzz/button/text.js"

class HomePage extends StatefulWidget {
	render(parent) {
		super.render(parent);

		return new ScrollableContainer({
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
								onHover: function (value) { 
									console.log(value ? "Meh..." : "NO!");
								}
							})
						]}
					),
				]
			}),
		});
	}
}

export {
	HomePage,
}

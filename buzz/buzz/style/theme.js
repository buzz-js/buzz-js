import { InsetsGeometry, RadialGeometry } from './insets.js';
import { Border } from './border.js';
import { FontFamily } from '../text/font.js';

class ThemeData {
	/**
	 * The color used for the text in this particular theme parameter.
	 * 
	 * @type {string}
	 */
	fontColor;

	/**
	 * 
	 * The color used for the text icons in this particular theme parameter.
	 * 
	 * @type {string}
	 */
	iconColor;


	constructor(fontColor = 'black', iconColor = 'black') {
		this.fontColor = fontColor;
		this.iconColor = iconColor;
	}
}


class TextTheme extends ThemeData {
	/**
	 * The amount of curvature for the borders of the text fields inside the app.
	 * 
	 * @type {RadialGeometry}
	 */
	borderRadius;

	/**
	 * The border around the text widgets in this app. Exactly like an outline.
	 * 
	 * @type {Border}
	 */
	border;

	/**
	 * The padding inside the text widgets in this app.
	 * 
	 * @type {InsetsGeometry}
	 */
	padding;

	/**
	 * The margin around the text widgets in this app.
	 * 
	 * @type {InsetsGeometry}
	 */
	margin;

	/**
	 * The typeface used in the app for all Text widgets.
	 * 
	 * @type {string} A string representing a valid font family in the default CSS namespace.
	 */
	fontFamily;

	/**
	 * Should be italic or such another constant you'd see in CSS.
	 * @type {string}
	 */
	fontStyle;

	/**
	 * Should be a valid CSS weight.
	 * @param {string}
	 */
	fontWeight;

	constructor({
		fontColor = 'black',
		iconColor = 'black',
		fontSize =  '1em',
		borderRadius = RadialGeometry.all('1em'),
		border = Border.none,
		padding = InsetsGeometry.all('10px'),
		margin = InsetsGeometry.zero,
		fontFamily = FontFamily.FONT_FAMILY_RALEWAY,
		fontStyle = 'none',
		fontWeight = 'normal',
		backgroundColor = 'yellow',
	} = {}) {
		super(fontColor, iconColor);

		this.borderRadius = borderRadius;
		this.border = border;
		this.padding = padding;
		this.margin = margin;
		this.fontFamily = fontFamily;
		this.fontStyle = fontStyle;
		this.fontWeight = fontWeight;
		this.backgroundColor = backgroundColor;
		this.fontSize = fontSize;
	}
}

class ButtonTheme extends TextTheme {
	fontColorDisabled;
	backgroundColorDisabled;
	textStyleDisabled;
	textDecorationDisabled;

	constructor({
		fontColor = 'black',
		iconColor = 'black',
		borderRadius = RadialGeometry.all('10px'),
		border = Border.none,
		padding = new InsetsGeometry().setVertical('0.8em').setHorizontal('2.8em'),
		margin = InsetsGeometry.zero,
		fontFamily = FontFamily.FONT_FAMILY_RALEWAY,
		fontStyle = 'none',
		fontWeight = 'bolder',
		fontSize = '1.2em',
		fontColorDisabled = "#000",
		backgroundColorDisabled = "#777777",
		backgroundColorHover = "black",
		fontColorHover = "yellow",
		backgroundColor = 'yellow',
		textStyleDisabled = "none",
		textDecorationDisabled = "none",
	} = {}) {
		super({
			fontColor: fontColor,
			iconColor: iconColor,
			borderRadius: borderRadius,
			border: border,
			padding: padding,
			margin: margin,
			fontFamily: fontFamily,
			fontStyle: fontStyle,
			fontWeight: fontWeight,
			fontSize: fontSize,
			backgroundColor: backgroundColor
		});

		// Now for the button specialties. 
		this.fontColorDisabled = fontColorDisabled;
		this.backgroundColorDisabled = backgroundColorDisabled;
		this.textStyleDisabled = textStyleDisabled;
		this.textDecorationDisabled = textDecorationDisabled;
		this.backgroundColorHover = backgroundColorHover;
		this.fontColorHover = fontColorHover;
	}
}

class EditTextTheme extends ThemeData {
	constructor({
		fontColor = 'black',
		fontColorHint = 'gray',
		iconSpacing  = '10px',
		iconColor = 'black',
		backgroundColor = 'yellow',
		borderRadius = RadialGeometry.all('10px'),
		border = new Border({
			lineWidth: '2px',
			lineType: Border.LINE_SOLID,
			color: 'black'
		}),
		padding = new InsetsGeometry().setVertical('0.8em').setHorizontal('0.8em'),
		margin = InsetsGeometry.zero,
		fontFamily = FontFamily.FONT_FAMILY_RALEWAY,
		fontStyle = 'none',
		fontWeight = 'bolder',
		fontSize = '1.2em',
	} = {}) {
		super(fontColor, iconColor);

		this.borderRadius = borderRadius;
		this.border = border;
		this.padding = padding;
		this.margin = margin;
		this.fontFamily = fontFamily;
		this.fontStyle = fontStyle;
		this.fontWeight = fontWeight;
		this.backgroundColor = backgroundColor;
		this.fontSize = fontSize;
		this.fontColorHint = fontColorHint;
		this.iconSpacing = iconSpacing;
	}
}

class AppTheme extends ThemeData {
	/**
	 * This is the primary color used in the entire application. It is used to do things like shading buttons, the outline of 
	 * text fields, and so on.
	 * 
	 * @type {string}
	 */
	primaryColor;

	/**
	 * This is the color used to add some variety to the theme. It can be said that this is used to create things like alternative 
	 * buttons. It is a color used when painting an object of a kind that would otherwise require a primary color, so usually it is
	 * either a different shade of the primary color or a color from the same, or a complementary, color spacing or warmth group.
	 * 
	 * @type {string}
	 */
	secondaryColor;

	/**
	 * This is the color used to add some contrast to the theme. It is used to paint things like icons, and the likes. It is usually
	 * used to paint objects that need to stand out in the theme generally speaking.
	 * 
	 * @type {string}
	 */
	accentColor;

	/**
	 * This is the color used to paint the canvas where all widgets would be drawn on top of. You can think of it as the background 
	 * color for the window.
	 * 
	 * @type {string}
	 */
	backgroundColor;

	/**
	 * The theme used for all text fields inside this app.
	 *
	 * @type {TextTheme}
	 */
	textTheme;

	/**
	 * The theme used for all the editable text fields inside this app.
	 * 
	 * @type {EditTextTheme}
	 */
	editTextTheme;

	/**
	 * The theme used for all the buttons used in this app.
	 *
	 * @type {ButtonTheme}
	 */
	buttonTheme;


	constructor(
		fontColor = 'black',{
		primaryColor = 'black', 
		secondaryColor = 'yellow',
		accentColor = 'black',  
		backgroundColor = Colors.white,
		textTheme = new TextTheme(),
		editTextTheme = new EditTextTheme(),
		buttonTheme = new ButtonTheme() 
	} = {}) {
		super(fontColor, accentColor);
		this.primaryColor = primaryColor;
		this.secondaryColor = secondaryColor;
		this.accentColor = accentColor;
		this.backgroundColor = backgroundColor;
		this.textTheme = textTheme;
		this.editTextTheme = editTextTheme;
		this.buttonTheme = buttonTheme;
	}
}

export {
	AppTheme,
	TextTheme,
	EditTextTheme,
	ButtonTheme,
}
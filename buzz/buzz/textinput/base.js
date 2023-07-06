import { BuzzStyleAttribute } from "../style/native.js";
import { WidgetStyle } from "../style/style.js";

class EditTextController {
    constructor(initialValue, {
        onTextChanged = undefined,
        onTextCompleted = undefined,
        onTextStarted = undefined,
    } = {}) {
        this.initialValue       = initialValue;
        this.onTextChanged      = onTextChanged;
        this.onTextCompleted    = onTextCompleted;
        this.onTextStarted      = onTextStarted;
    }
}

class EditTextType extends BuzzStyleAttribute {
    static email    = 'email';
    static phone    = 'phone';
    static number   = 'number';
    static password = 'password';
    static text     = 'text';
}

class EditTextStyle extends WidgetStyle {
    constructor({
		fontColor       = globalThis.buzzContext.theme.editTextTheme?.fontColor,
        iconColor       = globalThis.buzzContext.theme.editTextTheme?.iconColor,
		backgroundColor = globalThis.buzzContext.theme.editTextTheme?.backgroundColor,
        fontFamily      = globalThis.buzzContext.theme.editTextTheme?.fontFamily,
        fontWeight      = globalThis.buzzContext.theme.editTextTheme?.fontWeight,
		border          = globalThis.buzzContext.theme.editTextTheme?.border,
		borderRadius    = globalThis.buzzContext.theme.editTextTheme?.borderRadius,
		overflowType    = null,
        height          = MATCH_CONTENT,
		width           = MATCH_CONTENT
    } = {}) {
        super(fontColor,  { 
			background: backgroundColor,
			height: height, 
			width: width 
		});

        this.iconColor = iconColor;
		this.fontColor = fontColor;
		this.fontFamily = fontFamily;
		this.fontWeight = fontWeight;
		this.overflowType = overflowType;
		this.border = border;
		this.borderRadius = borderRadius;
    }
}

export {
    EditTextController,
    EditTextStyle,
    EditTextType
}
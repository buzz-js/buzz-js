import { StatelessWidget } from "../framework/widget.js"; 
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

class EditText extends StatelessWidget {
    /**
     * @param {EditTextController} controller The EditTextController used to initialize and monitor the 
     * changes in the value of this text field.
     */
    constructor(controller, {
        style = new EditTextStyle(),
        padding     = globalThis.buzzContext.theme.editTextTheme?.padding,
		margin      = globalThis.buzzContext.theme.editTextTheme?.margin,
		fontSize    = globalThis.buzzContext.theme.editTextTheme?.fontSize,
        type        = EditTextType.text
    } = {}) {
        super();

        // Save the styles.
        this.style = style;
        this.padding = padding;
        this.margin = margin;
        this.fontSize = fontSize;
        this.type = type;
    }


    render(parent) {
        super.render(parent);

        // Something like this


        // Mount this Widget and return it to itself.
        this.mounted = true;
        return this;
    }
}

export {
    EditText,
    EditTextController,
    EditTextStyle,
    EditTextType
}
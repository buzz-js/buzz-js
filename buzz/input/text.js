import { StateController } from "../framework/state.js";
import { BuzzStyleAttribute } from "../style/native.js";
import { WidgetStyle } from "../style/style.js";
import { InputController, InputWidget } from "./base.js";


/**
 * ## General
 */
class TextInputController extends InputController {
    /**
     * This is used to retrieve the current value of the TextInput widget that this Controller
     * is bound to.
     */
    get text() {
        if(this.widget) {
            return this.widget.superRaw.value;
        }

        return undefined;
    }

    constructor({
        onValueChanged = undefined,
        onValueCompleted = undefined,
        onValueStarted = undefined,
        onReactState = undefined,
    } = {}) {
        super({
            onValueChanged: onValueChanged,
            onValueCompleted: onValueCompleted,
            onValueStarted: onValueStarted,
            onReactState: onReactState
        });
    }

    setTextType(type) {
        if(this.widget) {
            this.widget.superRaw.type = type;
        }
    }
}

/**
 * ## General
 */
class TextInputType extends BuzzStyleAttribute {
    static email    = 'email';
    static phone    = 'phone';
    static number   = 'number';
    static password = 'password';
    static passwordVisible = 'text';
    static text     = 'text';
}

/**
 * ## General
 */
class TextInputStyle extends WidgetStyle {
    constructor({
		fontColor       = globalThis.buzzContext.theme.editTextTheme?.fontColor,
        fontColorHint   = globalThis.buzzContext.theme.editTextTheme?.fontColorHint,
        iconColor       = globalThis.buzzContext.theme.editTextTheme?.iconColor,
		backgroundColor = globalThis.buzzContext.theme.editTextTheme?.backgroundColor,
        fontFamily      = globalThis.buzzContext.theme.editTextTheme?.fontFamily,
        fontWeight      = globalThis.buzzContext.theme.editTextTheme?.fontWeight,
		border          = globalThis.buzzContext.theme.editTextTheme?.border,
		borderRadius    = globalThis.buzzContext.theme.editTextTheme?.borderRadius,
        iconSpacing     = globalThis.buzzContext.theme.editTextTheme?.iconSpacing,
		overflowType    = null,
        height          = '100%',
		width           = '100%'
    } = {}) {
        super(fontColor,  { 
			background: backgroundColor,
			height: height, 
			width: width 
		});

        this.iconColor = iconColor;
		this.fontColor = fontColor;
		this.fontColorHint = fontColorHint;
		this.fontFamily = fontFamily;
		this.fontWeight = fontWeight;
		this.overflowType = overflowType;
		this.border = border;
		this.borderRadius = borderRadius;
        this.iconSpacing = iconSpacing;
    }
}

/**
 * ## General
 * An `InputWidget` that reads editable text input from the user. Hence, its really 
 * unintuitive name `TextInput`.
 * 
 * 
 * For Example, take the usage of this Widget below.
 * 
 * ```javascript
 * import { 
 *      TextInput,
 *      TextInputController 
 * } from './buzz/input/text.js';
 * import { Icon } from './buzz/icon/icon.js';
 * import { IconButton } from './buzz/input/button/icon.js';
 * import { StatelessWidget } from './buzz/framework/widget.js';
 * 
 * class LoginScreen extends StatelessWidget {
 *      emailText = new TextInputController();
 *	    passwordText = new TextInputController({
 *		    onReactState: (icon, _, current) => {
 *		    	icon.endIcon.icon.update({
 *		    		data: current ? SolidIcons.eyeSlash : SolidIcons.eye,
 *		    		color: current ? 'black' : 'red' 
 *		    	});
 *
 *		        icon.inputController.setTextType(current ? TextInputType.password : TextInputType.passwordVisible);
 *		    }
 *	    });
 *
 *	    // This is the way the controller works.
 *	    passwordController = new StateController({
 *	    	initial: true, 
 *	    	reactive: true
 *	    });
 *
 * 
 *      render(parent) {
 *		    super.render(parent);
 *
 *		    return new ScrollableContainer({
 *			    controller: new ScrollController(true, false),
 *			    style: new ContainerStyle({
 *			    	alignment: Alignment.topCenter // Align this view to the center.
 *			    }),
 *			    child: new Column({
 *			    children: [
 *			    	// TL; Skip It  
 *				   	new TextInput(this.passwordText, {
 *				   		controller: this.passwordController,
 *				   		margin: InsetsGeometry.only({bottom: '5em'}),
 *				   		hint: "Enter your password",
 *				   		type: TextInputType.password,
 *				   		startIcon: new Icon(
 *				   			SolidIcons.anchorSecure, {
 *				   				margin: InsetsGeometry.only({right: '10px'}),
 *				   				size: '24px'
 *				   			}
 *				   		),
 *
 *					endIcon: new IconButton(
 *				    	new Icon(
 *				    		SolidIcons.eyeSlash, {
 *				    			color: 'black',
 *				    		}
 *				    	), {
 *				    		onClick: () => {
 *				    			// Yeah, just change the state of the controller.
 *				    			this.passwordController.state = !this.passwordController.state;
 *				    		},
 *				    	})
 *				    }),
 *				]
 *			}),
 *		});
 *	}
 * }
 * ```
 * 
 * LoL, to see this example in a realistic and practical use case, check out the behavior
 * of the TextInput widget in the project template dashboard app. You can access this
 * template file with the command
 * 
 * ```sh
 * bumble create --template=dashboard_app
 * ```
 *
 */
class TextInput extends InputWidget {
    /**
     * Get the type of text this TextInput Widget expects to read.
     */
    get type() {
        // Return the type of this text node.
        return this.raw?.type;
    }

    /**
     * @param {TextInputController} textController The TextInputController used to initialize and monitor the 
     * changes in the value of this text field.
     */
    constructor(textController, {
        name = undefined,
        controller = new StateController(), 
        style = new TextInputStyle(),
        hint        =  "",
        padding     = globalThis.buzzContext.theme.editTextTheme?.padding,
		margin      = globalThis.buzzContext.theme.editTextTheme?.margin,
		fontSize    = globalThis.buzzContext.theme.editTextTheme?.fontSize,
        type        = TextInputType.text,
        startIcon   = undefined,
        endIcon     = undefined,
    } = {}) {
        super(controller, textController);

        // Save the styles.
        this.style = style;
        this.padding = padding;
        this.margin = margin;
        this.fontSize = fontSize;
        this.hint = hint;
        this.startIcon = startIcon;
        this.endIcon = endIcon;

        // First, create the outer container...
        this.raw = document.createElement('div');
        this.raw.style.display = "flex";
        this.raw.style.flexDirection = "row";
        this.raw.style.alignItems = "center";
        this.raw.style.justifyContent = "stretch";
        this.raw.style.width = "100%";
        this.raw.style.gap = '10px';

        // Second, create the inner container.
        this.superRaw = document.createElement("input");
        this.superRaw.id = this.key;
        this.superRaw.type = type;
        this.superRaw.placeholder = hint;
        this.superRaw.name = name ? name : this.key;

        // Remove the outline from this TextInput widget so that when it is
        // selected, we are good.
        this.superRaw.style.outline = 'none';
    }


    render(parent) {
        super.render(parent);

        // Apply the initial style...
        this.applyStyle(false);

        // Next, we move to provisional styling.
        if(this.startIcon) {
            let icon = this.startIcon;

            if(!icon.mounted) {
                icon = icon.render();
            }

            this.raw.appendChild(icon.raw);
        }

        // Append this child to the div.
        this.raw.appendChild(this.superRaw);

        // Finally, if this has an end icon...
        if(this.endIcon) {
            let icon = this.endIcon;

            if(!icon.mounted) {
                icon = icon.render();
            }

            this.raw.appendChild(icon.raw);
        }

        // Set the TextInput's true width to 100%
        this.superRaw.style.width = "100%";

        // This is fair enough too.
        if(this.fontSize)  {
			this.raw.style.fontSize = this.fontSize;
		}

		// Moving forward, it is time for the text styling....
		if(this.style) { // Inline styling takes the first precedent
            this.superRaw.style.color 		= this.style.color;
			this.superRaw.style.fontFamily 	= this.style.fontFamily;
			this.superRaw.style.fontWeight 	= this.style.fontWeight;
			this.raw.style.width 		= this.style.width;
			this.raw.style.height 		= this.style.height;
        }

        // Mount this Widget and return it to itself.
        this.mounted = true;
        return this;
    }

    /**
     * 
     * @returns The Widget treated as an Icon at the tail end of this TextInput
     */
    getEndIcon() {
        return this.endIcon;
    }

    /**
     * 
     * @returns The Widget treated as the leading Icon at the beginning of this TextInput 
     */
    getStartIcon() {
        return this.startIcon;
    }
}

export {
    TextInput,
    TextInputController,
    TextInputStyle,
    TextInputType
}
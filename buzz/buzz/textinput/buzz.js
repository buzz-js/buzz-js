import { StatelessWidget } from "../framework/widget.js"; 
import { EditTextController, EditTextStyle, EditTextType } from "./base.js";

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
    EditText
}
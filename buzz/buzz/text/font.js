import { BuzzStyleAttribute } from "../style/native.js";

/**
 * The class that encloses all font families that are included in vanilla CSS.
 */
class FontFamily  extends BuzzStyleAttribute {
	static FONT_FAMILY_LATO = "Lato";
	static FONT_FAMILY_RALEWAY = "Raleway";
	static FONT_FAMILY_OPEN_SANS = "Open-Sans";
	static FONT_FAMILY_SANS_SERIF = "sans-serif";
}

export {
	FontFamily
}
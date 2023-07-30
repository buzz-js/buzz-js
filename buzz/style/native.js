/**
 * This is a base class used to imply that an element is represented internally as a string equivalent to its CSS counterpart.
 * This is used for the more complicated things like animations, borders, and so on. Basically, things that would require extra
 * abstractions to make work in an SDK so I circumvent them by directly utilizing pure CSS.
 */
 class NativeStyleElement {
	/**
	 * Converts the value of a native style element to its pure CSS variant. 
	 * Eliminating all the abstractions originally created by the structures of the Buzz SDK.
	 */
	toStylesheet() {}
}

class BuzzStyleAttribute {
	constructor() {
		throw("Attempted to create an instance of a static class in Buzz. Classes like this exist just so you can use the constants therein.");
	}
}

export {
	NativeStyleElement,
	BuzzStyleAttribute
}
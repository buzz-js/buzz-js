import { Widget } from '../framework/widget.js';
import { View } from './view.js';
import { StatefulWidget } from '../framework/state.js';

/**
 * Uses the default HTML/CSS emission render engine.
 */
const RENDER_MODE_DEFAULT = 1;

/**
 * Uses an experimental render mode that uses WebAssembly to generate the webpages.
 */
const RENDER_MODE_WASM = 2;

class RenderObject {
	static instance = new RenderObject();

	constructor() {}

	/**
	 * This is the function that helps to convert Buzz widgets to document elements. It should not be called by an application ever
	 * because it might result in unexpected behavior. Typically, this is called by the framework when the state of any widget is 
	 * changed or a widget is initialized.
	 *
	 * @param {Widget} object The object that the renderer is supposed to paint. This can only be something that inherits from the 
	 * Widget class. Anything else would throw an exception. 
	 * 
	 * @param {View} viewport The viewport to paint this object inside of. Typically, the viewport the widget owns.
	 */
	paint(object, viewport) {
		if(!object instanceof Widget) {
			throw("Attempted to render an object that is not a Widget.");
		}

		// First, build this widget before doing anything arguably unnecessary.
		const widget = object.render(object.context);

		// Here we render the widget to the screen by binding the generated HTML code.
		viewport.node.appendChild(widget.raw);

		// After this widget has been rendered, we change the value of the built state.
		if(object instanceof StatefulWidget) {
			object.built = true;
		}

		// This has been mounted.
		object.mounted  = true;

		// Last, it is time to call the function we execute right after the widget is rendered.
		object.postRender.call(object, object.context);
	}
}

export {
	RenderObject,
	RENDER_MODE_DEFAULT,
	RENDER_MODE_WASM
}
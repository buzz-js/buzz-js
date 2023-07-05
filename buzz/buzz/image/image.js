import { panic } from '../framework/utilities.js';
import { StatelessWidget } from '../framework/widget.js';
import { GONE, INVISIBLE } from '../render/view.js';
import { Colors } from '../style/color.js';
import { BuzzStyleAttribute } from '../style/native.js';
import { MATCH_CONTENT, WidgetStyle } from '../style/style.js';

/**
 * This manages the geometry of the associated image.
 */
class ImageGeometry extends BuzzStyleAttribute {
	/**
	 * An image that's completely circular
	 */
	static geometryCircular = 'image-circular';

	/** 
	 * An image that is quadrilateral and rounded at the corners.
	*/
	static geometryRoundedRect	= 'image-squircle';

	/**
	 * An image that is a quadrilateral with cornered
	 */
	static geometryRectangle= 'image-rect';
}


/**
 * This is used to
 */
class ImageFit extends BuzzStyleAttribute {
	/**
	 * The size of the image is modified so that it can fill its container but it would maintain its previous
	 * aspect ratio. 
	 *
	 * @type {string}
	 */
	static cover = "cover";
	
	/**
	 * The size of the image is resolved until it can fit inside its container's space while preserving its
	 * original aspect ratio without distorting the information in the image.
	 *
	 * @type {string}
	 */
	static contain = "contain";

	/**
	 * Resize the image as if until it can fit inside the container only if it does not already fit. Basically,
	 * we decide between the both options and use whichever one would result in a containment that preserves both
	 * aspect ratio and information without distorting the image's elements.
	 *
	 * @type {string}
	 */
	static scaleDown = "scale-down";

	/**
	 * The image is resized to fill its container completely.
	 *
	 * @type {string}
	 */
	static fill = "fill";


	/**
	 * Don't do anything to fit this image inside it's container. "Whatever would happen
	 * would happen". It's basically the equivalent of saying you do not want to make any extra effort
	 * to fit the image inside its container.
	 *
	 * @type {string}
	 */
	static none = "none";
}

/**
 * This is used to style an image.
 */
class ImageStyle extends WidgetStyle {
	static stock = new ImageStyle();

	/**
	 * 
	 * @param {string} height A valid CSS-style dimension that indicates the height of this image.
	 * @param {string} width A valid CSS-style dimension that indicates the width of this image.
	 * @param {BoxShadow} shadow The shadow around the geometrical scope of this image.
	 * @param {string} shape This is the geometry we chose to give to this image.
	 * @param {string} fit How should we fit this image inside the screen?
	 * @param {boolean} lazy Should we load this Image in the background for you while a placeholder is currently on the screen?
	 */
	constructor({
		height = MATCH_CONTENT,
		width = MATCH_CONTENT,
		shadow = null,
		shape  = ImageGeometry.geometryRectangle,
		fit = ImageFit.none,
		lazy = false
	} = {}) {
		super(null, {
			background: null,
			height: height,
			width: width,
			shadow: shadow,
		});

		// The shape of this image.
		this.shape = shape;
		this.fit = fit;
		this.lazy = lazy;
	}
}

/**
 * This is a Widget typically used to display images inside a BuzzApp.
 */
class ImageView extends StatelessWidget {
	constructor(src, {
		imageStyle = ImageStyle.stock,
		padding = null,
		margin = null,
		visibility = null,
		alt = "An ImageView showing something on the screen."
	} = {}) {
		super();

		this.src = src;
		this.imageStyle = imageStyle;
		this.padding = padding;
		this.margin = margin;
		this.visibility = visibility;
		this.alt = alt;

		// Next, we create the HTML element.
		this.raw = document.createElement("img");
		this.raw.id = this.key;
	}

	render(parent) {
		super.render(parent);

		// Keep the URI of this resource.
		this.raw.src = this.src;
		this.raw.alt = this.alt;

		// Images are not allowed to go past the width of their containers
		this.raw.style.maxWidth = '100%';

		// Next, add additional information like 
		if(this.imageStyle !== null && this.imageStyle !== undefined) {
			this.raw.style.height = this.imageStyle.height;
			this.raw.style.width = this.imageStyle.width;

			// Apply the margin
			if(this.margin !== null && this.margin !== undefined) {
				this.raw.style.marginTop 	= this.margin?.top;
				this.raw.style.marginBottom= this.margin?.bottom;
				this.raw.style.marginLeft 	= this.margin?.left;
				this.raw.style.marginRight = this.margin?.right;
			}

			// Next, apply the padding.
			if(this.padding !== null && this.padding !== undefined) {
				this.raw.style.paddingTop 	= this.padding?.top;
				this.raw.style.paddingBottom= this.padding?.bottom;
				this.raw.style.paddingLeft 	= this.padding?.left;
				this.raw.style.paddingRight = this.padding?.right;
			}

			if(this.imageStyle.shape === ImageGeometry.geometryCircular) {
				this.raw.style.clipPath = "circle()";
			}

			else if(this.imageStyle.shape === ImageGeometry.geometryRectangle) {
				this.raw.style.clipPath = "";
				this.raw.style.borderRadius = "0";
			}

			else if(this.imageStyle.shape === ImageGeometry.geometryRoundedRect) {
				this.raw.style.borderRadius = "15px";
			}

			else {
				panic("Unexpected ImageStyle constant " + this.imageStyle.shape + " for the shape of an ImageView.", this);
			}
		}

		// Now, to implement the visibility
		if(this.visibility === GONE) {
			this.raw.style.display = 'none';
		}

		// Fit this image according to what was specified by th 
		this.raw.style.objectFit = this.imageStyle.fit;

		// TODO: #3 Use information from the overlay of the image

		// Now, this has been mounted and then you can return its reference to the almighty renderer.
		this.mounted = true;
		return this;
	}
}

export {
	ImageView,
	ImageStyle,
	ImageGeometry,
	ImageFit
};

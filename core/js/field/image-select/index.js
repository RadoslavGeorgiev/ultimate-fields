import Input from './component';
import Model from './model';

/**
 * Registers the image select field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'image_select', {
		Input,
		Model,
	} );
}

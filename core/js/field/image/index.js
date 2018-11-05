import Input from './component';
import Model from 'field/file/model';

/**
 * Registers the image field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'image', {
		Input,
		Model,
	} );
}

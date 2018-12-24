import Input from './component';
import Model from './model';

/**
 * Registers the Objects field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'wp_objects', {
		Input,
		Model,
	} );
}

/**
 * Internal dependencies
 */
import Model from './model';

/**
 * Registers tabs as a field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'tab', {
		Model,
	} );
}

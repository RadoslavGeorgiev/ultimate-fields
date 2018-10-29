/**
 * Internal dependencies
 */
import Input from './component';
import Element from './element';
import Model from './model';

/**
 * Registers the section "field".
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'section', {
		Input,
		Element,
		Model,
	} );
}

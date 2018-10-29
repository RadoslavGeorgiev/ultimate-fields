/**
 * Internal dependencies
 */
import Input from './component';
import Model from './model';

/**
 * Registers the WYSIWYG field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'wysiwyg', {
		Input,
		Model,
	} );
}

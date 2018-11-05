import Input from './component';
import Model from './model';

/**
 * Registers the audio field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'audio', {
		Input,
		Model,
	} );
}

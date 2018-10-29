import Input from './component';
import Model from './model';
import reducers from './state/reducers';

/**
 * Registers the file field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'file', {
		Input,
		Model,
		reducers,
	} );
}

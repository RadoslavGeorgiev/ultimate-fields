import Input from './components/repeater';
import Model from './model';
import reducers from './state/reducers';

/**
 * Registers the repeater field.
 *
 * @param {Function} register A function to use to register the field type.
 */
export default function( register ) {
	register( 'repeater', {
		Input,
		Model,
		reducers
	} );
}

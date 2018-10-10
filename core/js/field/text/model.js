/**
 * External dependencies.
 */
import { isString } from 'lodash';

/**
 * Internal dependencies
 */
import Model from 'field/model';

export default class TextFieldModel extends Model {
	/**
	 * Converts values to the correct type during load.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {*}      value The value that is being loaded.
	 * @return {string}       A proper string.
	 */
	loadValue( props, value ) {
		if( ( 'undefined' === value ) || false === value || null === value ) {
			return '';
		}

		return isString( value )
			? value
			: '' + value;
	}
}

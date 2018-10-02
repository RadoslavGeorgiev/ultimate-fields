import { isString } from 'lodash';

import FieldModel from 'field/model';

export default class TextFieldModel extends FieldModel {
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

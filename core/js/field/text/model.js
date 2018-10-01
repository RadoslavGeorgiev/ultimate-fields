import { isString } from 'lodash';

import FieldModel from './../field/model';

export default class TextFieldModel extends FieldModel {
	importValue( value ) {
		if( false === value || null === value ) {
			return '';
		}

		return isString( value )
			? value
			: '' + value;
	}
}

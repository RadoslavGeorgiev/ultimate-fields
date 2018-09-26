import { isString } from 'lodash';

import FieldModel from './../field/model';

export default class TextFieldModel extends FieldModel {
	importValue( value ) {
		return isString( value )
			? value
			: '' + value;
	}
}

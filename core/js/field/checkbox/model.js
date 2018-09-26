import { isString } from 'lodash';

import FieldModel from './../field/model';

export default class CheckboxFieldModel extends FieldModel {
	importValue( value ) {
		return !! value;
	}
}

import { isString } from 'lodash';

import FieldModel from 'field/model';

export default class CheckboxFieldModel extends FieldModel {
	loadValue( props, value ) {
		return !! value;
	}
}

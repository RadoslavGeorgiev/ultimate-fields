/**
 * External dependencies.
 */
import { isArray } from 'lodash';

/**
 * Internal dependencies
 */
import SelectFieldModel from 'field/select/model';

export default class MultiselectFieldModel extends SelectFieldModel {
	/**
	 * Converts values to the correct type during load.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {*}      value The value that is being loaded.
	 * @return {Array}        An array of checked values.
	 */
	loadValue( props, value ) {
		if ( ! isArray( value ) ) {
			value = [ value ];
		}

		return value.filter( item => !! item );
	}

	/**
	 * Returns a default value if one is not present in the props.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return {Array}        An empty array.
	 */
	getEmptyValue( props ) {
		return [];
	}
}

/**
 * External dependencies.
 */
import { forEach, isUndefined } from 'lodash';

/**
 * Internal dependencies
 */
import Model from 'field/model';

export default class SelectFieldModel extends Model {
	/**
	 * Converts values to the correct type during load.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {*}      value The value that is being loaded.
	 * @return {Array}        An array of checked values.
	 */
	loadValue( props, value ) {
		const { options } = props;

		if ( value && options.hasOwnProperty( value ) ) {
			return value;
		}

		return Object.keys( options )[ 0 ];
	}

	/**
	 * Returns a default value if one is not present in the props.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return {string}       An empty string, suitable for most field types.
	 */
	getEmptyValue( props ) {
		const { options } = props;

		let firstKey;

		forEach( options, ( value, key ) => {
			if ( isUndefined( firstKey ) ) {
				firstKey = key;
			}
		} )

		return firstKey;
	}
}

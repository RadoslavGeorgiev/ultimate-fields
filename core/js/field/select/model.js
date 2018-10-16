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

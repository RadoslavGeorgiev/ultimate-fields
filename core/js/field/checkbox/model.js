/**
 * Internal dependencies.
 */
import Model from 'field/model';

export default class CheckboxFieldModel extends Model {
	/**
	 * Prepares the value of the checkbox field.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {*}      value The value to prepare.
	 * @return {Boolean}      A normalized value for the input.
	 */
	loadValue( props, value ) {
		return !! value;
	}
}

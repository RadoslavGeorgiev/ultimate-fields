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
	 * Avoids loading data.
	 *
	 * @return {Array} An empty list.
	 */
	getInitialActions() {
		return [];
	}

	/**
	 * Avoids saving data.
	 *
	 * @return {Object} An empty object.
	 */
	extractDataFromState() {
		return {};
	}
}

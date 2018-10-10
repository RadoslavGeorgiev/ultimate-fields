/**
 * Internal dependencies
 */
import Model from 'field/model';

export default class TabModel extends Model {
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

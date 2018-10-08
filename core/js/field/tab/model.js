import FieldModel from 'field/model';

export default class TabFieldModel extends FieldModel {
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

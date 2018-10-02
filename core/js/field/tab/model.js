import FieldModel from 'field/field/model';

export default class TabFieldModel extends FieldModel {
	/**
	 * Avoids loading data.
	 *
	 * @return {Object} An empty object.
	 */
	getInitialData() {
		return {};
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

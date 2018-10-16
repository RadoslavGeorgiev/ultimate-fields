/**
 * External dependencies.
 */

/**
 * Internal dependencies
 */
import Model from 'field/model';
import { updateValue } from 'state/data/actions';
import { generateInitilizationActionsList, getValidationErrors } from 'container';
import { generateContainerId } from 'utils';

export default class ComplexFieldModel extends Model {

	/**
	 * Returns an empty value.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return {Object}       An empty object.
	 */
	getEmptyValue( props ) {
		return {};
	}

	/**
	 * Generates a list of actions, required to initialize the state.
	 *
	 * @param  {Object} props   The definition of a field.
	 * @param  {Object} context The initial data that is available.
	 * @return {Object}         An object that will be parsed by the reducers.
	 */
	getInitialActions( props, context ) {
		const { name, group, merge, dataPath: baseDataPath } = props;
		const { fields } = group;

		// Load the context and path
		const data     = context[ name ] || {};
		const dataPath = merge ? baseDataPath : [ ...baseDataPath, name ];

		// Generate a container ID
		const container = generateContainerId( 'complex-' )

		let actions = [];

		// Initial value must include the container
		if ( merge ) {
			actions.push( updateValue( dataPath, {
				__container: container,
			} ) );
		} else {
			actions.push( updateValue( dataPath, container ) );
		}

		// Populate all sub-fields
		actions = actions.concat( generateInitilizationActionsList( {
			container,
			dataPath,
			fields,
			data,
		} ) );

		return actions;
	}
}

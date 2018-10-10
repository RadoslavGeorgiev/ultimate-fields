/**
 * External dependencies
 */
import { find, forEach, isUndefined, isNull } from 'lodash';

/**
 * Internal dependencies
 */
import Model from 'field/model';
import { generateInitilizationActionsList } from 'container';
import { updateValue } from 'state/data/actions';
import { addRepeaterRow } from './state/actions';
import { generateContainerId, mergeWithArrays } from 'utils';
import { createBatch } from 'state/batch/actions';
import { ADD_NEW_REPEATER_GROUP } from './state/action-types';

export default class RepeaterFieldModel extends Model {
	/**
	 * Returns an empty value.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return {Array}        An empty array.
	 */
	getEmptyValue( props ) {
		return [];
	}

	/**
	 * Locates the definition of a group based on its type.
	 *
	 * @param {Object} props The definition of a field.
	 * @param {string} type  The type of the group.
	 * @type  {Object}       The Settings of the group.
	 */
	findGroup( props, type ) {
		const { groups } = props;

		return find( groups, { id: type } );
	}

	/**
	 * Generates a list of actions, required to initialize the state.
	 *
	 * @param  {Object} props   The definition of a field.
	 * @param  {Object} context The initial data that is available.
	 * @return {Object}         An object that will be parsed by the reducers.
	 */
	getInitialActions( props, context ) {
		const { name, dataPath } = props;

		// Locate the basic value
		let value = context[ name ];
		if( isNull( value ) || isUndefined( value ) ) {
			value = this.getDefaultValue( props );
		}

		let actions = [
			// Start with an empty value
			updateValue( [ ...dataPath, name ], [] ),
		];

		forEach( value, ( row, index ) => {
			const group = this.findGroup( props, row.__type );

			// Create a container ID
			const container = generateContainerId( 'group-' );

			// Add the basic group
			actions.push( addRepeaterRow( name, dataPath, index, row.__type, container ) );

			// Populate all sub-fields
			actions = actions.concat( generateInitilizationActionsList( {
				container,
				dataPath: [ ...dataPath, name, index ],
				fields: group.fields,
				data: row,
			} ) );
		} );

		return actions;
	}

	/**
	 * Maps a dispatcher to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapDispatchToProps() {
		return ( dispatch, props ) => {
			return {
				addRow: index => this.addEmptyRow( props, index, dispatch ),
			};
		}
	}

	/**
	 * Adds a new row to the repeater.
	 *
	 * @param {Object}   props    The definition of a field.
	 * @param {number}   index    An index, generated by the view.
	 * @param {function} dispatch The function that will dispatch actions.
	 */
	addEmptyRow( props, index, dispatch ) {
		const { name, dataPath, groups } = props;

		console.time( 'repeater-add' );

		const container = generateContainerId( 'group-' );
		const group     = groups[ 0 ];

		// Add an empty row
		let actions = [
			addRepeaterRow( name, dataPath, index, group.id, container ),
		];

		// Populate all sub-fields
		actions = actions.concat( generateInitilizationActionsList( {
			container,
			dataPath: [ ...dataPath, name, index ],
			fields: group.fields,
			data: {},
		} ) );

		dispatch( createBatch( ADD_NEW_REPEATER_GROUP, actions ) );

		console.timeEnd( 'repeater-add' );
	}
}

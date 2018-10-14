/**
 * External dependencies
 */
import { find, forEach, isUndefined, isNull } from 'lodash';
import { batchActions } from 'redux-batched-actions';

/**
 * Internal dependencies
 */
import { sprintf } from 'utils';
import translate from 'utils/l10n';
import Model from 'field/model';
import { generateInitilizationActionsList, getValidationErrors } from 'container';
import { updateValue } from 'state/data/actions';
import { addRepeaterRow, cloneRepeaterRow, reorderRepeaterRows } from './state/actions';
import { generateContainerId, mergeWithArrays } from 'utils';
import { ADD_NEW_REPEATER_ROW, CLONE_REPEATER_ROW } from './state/action-types';

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
			actions.push( addRepeaterRow( name, dataPath, row.__type, container, null, row.__hidden ) );

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
			const { name, dataPath } = props;

			return {
				addRow:      ( type, position = null ) => this.addEmptyRow( props, type, position, dispatch ),
				onDuplicate: ( data, index ) => this.duplicateRow( props, data, index, dispatch ),
				onReorder:   ( order )       => dispatch( reorderRepeaterRows( [ ...dataPath, name ], order ) ),
			};
		}
	}

	/**
	 * Adds a new row to the repeater.
	 *
	 * @param {Object}   props    The definition of a field.
	 * @param {string}   type     The type of group to add.
	 * @param {number}   position The position for the row (optional);
	 * @param {function} dispatch The function that will dispatch actions.
	 */
	addEmptyRow( props, type, position, dispatch ) {
		const { name, dataPath, groups } = props;

		console.time( 'repeater-add' );

		const container = generateContainerId( 'group-' );
		const group     = this.findGroup( props, type );

		// Add an empty row
		let actions = [
			addRepeaterRow( name, dataPath, group.id, container, position ),
		];

		// Populate all sub-fields
		actions = actions.concat( generateInitilizationActionsList( {
			container,
			dataPath: [ ...dataPath, name, position ],
			fields: group.fields,
			data: {},
		} ) );

		dispatch( batchActions( actions, ADD_NEW_REPEATER_ROW ) );

		console.timeEnd( 'repeater-add' );
	}

	/**
	 * Checks whether the value of the field is valid or not.
	 *
	 * @param  {Object}   props    The definition of the field.
	 * @param  {Object}   state    The global Redux state.
	 * @param  {Function} dispatch The global dispatcher.
	 * @return {Boolean}
	 */
	isValid( props, state, dispatch ) {
		const { name, dataPath, containerPath } = props;

		let errors = [];
		const value  = this.getValueFromState( props, state );

		value.forEach( ( row, index ) => {
			const group = this.findGroup( props, row.__type );

			const { fields } = group;
			const localErrors = getValidationErrors(
				state,
				dispatch,
				fields,
				[ ...dataPath, name, index ], // dataPath
				[ ...containerPath, name, row.__container ] // containerPath
			);

			errors = errors.concat( localErrors );
		} );

		return 0 === errors.length;
	}

	/**
	 * Generates the required validation message.
	 *
	 * @param  {Object} props The definition of the field.
	 * @return {string}
	 */
	getValidationMessage( props ) {
		return props.validation_message
			? sprintf( props.validation_message, props.label )
			: translate( 'repeater_incorrect_value', props.label );
	}

	/**
	 * Handles the duplication of a row within a repeater.
	 *
	 * @param {Object}   props    The definition of the repeater.
	 * @param {Object}   data     The data of the group that is being cloned.
	 * @param {number}   index    The index of the group to clone.
	 * @param {Function} dispatch The store dispatcher.
	 */
	duplicateRow( props, data, index, dispatch ) {
		const { dataPath: context, name } = props;
		const { __type: type } = data;

		const dataPath   = [ ...context, name ];
		const { fields } = this.findGroup( props, type );
		const container  = generateContainerId( 'group-' );

		const actions = [
			cloneRepeaterRow( container, dataPath, index, data.__container ),
			...generateInitilizationActionsList( {
				container,
				dataPath: [ ...dataPath, index + 1 ],
				data,
				fields,
				ignoreTabs: true,
			} ),
		]

		dispatch( batchActions( actions, CLONE_REPEATER_ROW ) );
	}
}

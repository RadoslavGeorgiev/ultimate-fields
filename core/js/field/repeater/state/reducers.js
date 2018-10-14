/**
 * External dependencies
 */
import { set, get, unset, reduce, map, find } from 'lodash';

/**
 * Internal dependencies
 */
import { mergeWithArrays } from 'utils';
import {
	ADD_NEW_REPEATER_ROW,
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
	INSERT_CLONED_REPEATER_ROW,
	TOGGLE_REPEATER_ROW,
	REORDER_REPEATER_ROWS,
} from './action-types';

export default {
	data: {
		/**
		 * Handles the addition of a repeater row.
		 *
		 * @param {Object}  state            The current sub-state.
		 * @param {Object}  action           The action that will be processed.
		 * @param {string}  action.groupType The type of the new group.
		 * @param {string}  action.name      The name of the repeater field.
		 * @param {Array}   action.path      The data path of the repeater field.
		 * @param {string}  action.container A unique container ID.
		 * @param {boolean} action.hidden    An indicator for the group's visiblity.
		 * @type  {Object}                   The new state.
		 */
		[ ADD_REPEATER_ROW ]: ( state, { groupType, name, path, container, index, hidden } ) => {
			const rows = [
				{
					__container: container,
					__type: groupType,
					__hidden: hidden,
				},
			];

			const diff = set( {}, [ ...path, name ], rows );

			return mergeWithArrays( state, diff );
		},

		/**
		 * Deleters a repeater row.
		 *
		 * @param {Object} state        The Redux sub-state.
		 * @param {Object} action       The action that is being processed.
		 * @param {string} action.path  The path to the repeater's data.
		 * @param {number} action.index The index of the row to delete.
		 * @type  {Object}
		 */
		[ DELETE_REPEATER_ROW ]: ( state, { path, index } ) => {
			const rows = get( state, path, [] )
				.filter( ( row, i ) => i !== index );

			return {
				...set( state, path, rows ),
			};
		},

		/**
		 * Clones a repeater row next to itself.
		 *
		 * @param {Object} state            The Redux sub-state.
		 * @param {Object} action           The action that is being processed.
		 * @param {Array}  action.path      The data path of the repeater field.
		 * @param {number} action.index     The index of the old group.
		 * @param {string} action.container The ID of the new group.
		 * @type  {Object}
		 */
		[ INSERT_CLONED_REPEATER_ROW ]: ( state, { path, index, container } ) => {
			// Load data
			const rows = get( state, path );

			// Prepare vars
			const newIndex = index + 1;
			const { __type, __hidden } = rows[ index ];

			// Insert the new row into the list and get it back to the state
			const subState = [ ...rows ];
			subState.splice( newIndex, 0, {
				__container: container,
				__type,
				__hidden,
			} );

			return set( { ...state }, path, subState );
		},

		/**
		 * Toggles the visibility of a repeater row.
		 *
		 * @param  {Object} state       The Redux sub-state.
		 * @param  {Array}  action.path The path to the group's data.
		 * @return {Object}
		 */
		[ TOGGLE_REPEATER_ROW ]: ( state, { path } ) => {
			const subPath = [ ...path, '__hidden' ];
			return set( state, subPath, ! get( state, subPath, false ) );
		},

		/**
		 * Reorders the rows of the repeater.
		 *
		 * @param  {Object} state        The Redux sub-state.
		 * @param  {Array}  action.path  The path to the field's data.
		 * @param  {Array}  action.order The new order of the groups.
		 * @return {Object}
		 */
		[ REORDER_REPEATER_ROWS ]: ( state, { path, order } ) => {
			const source = get( state, path, [] );
			const target = map( order, __container => find( source, { __container } ) );

			return set( state, path, target );
		},
	},

	tabs: {
		/**
		 * Clones the active tab from one repeater row to the next.
		 *
		 * @param {Object} state               The Redux sub-state.
		 * @param {Object} action              The action that is being processed.
		 * @param {string} action.container    The container ID of the new group.
		 * @param {string} action.oldContainer The container ID of the old group.
		 * @type  {Object}
		 */
		[ INSERT_CLONED_REPEATER_ROW ]: ( state, { oldContainer, container } ) => ( {
			...state,
			[ container ]: state[ oldContainer ],
		} ),

		/**
		 * Clears tabs whenever a repeater row is deleted.
		 *
		 * @param {Object} state            The Redux sub-state.
		 * @param {Object} action           The action that is being processed.
		 * @param {string} action.container The container ID of the group.
		 * @type  {Object}
		 */
		[ DELETE_REPEATER_ROW ]: ( state, { container } ) => {
			const newState = { ...state };
			unset( state, container );
			return newState;
		},
	},
};

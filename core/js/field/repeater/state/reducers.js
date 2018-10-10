/**
 * External dependencies
 */
import { set, get, unset } from 'lodash';

/**
 * Internal dependencies
 */
import { mergeWithArrays } from 'utils';
import {
	ADD_NEW_REPEATER_GROUP,
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';

export default {
	data: {
		/**
		 * Handles the addition of a repeater row.
		 *
		 * @param {Object} state            The current sub-state.
		 * @param {Object} action           The action that will be processed.
		 * @param {string} action.groupType The type of the new group.
		 * @param {string} action.name      The name of the repeater field.
		 * @param {Array}  action.path      The data path of the repeater field.
		 * @param {string} action.container A unique container ID.
		 * @param {number} action.index     The index of the group.
		 * @type  {Object}                  The new state.
		 */
		[ ADD_REPEATER_ROW ]: ( state, { groupType, name, path, container, index } ) => {
			const rows = [];

			rows[ index ] = {
				__container: container,
				__type: groupType,
				__hidden: false,
			};

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
	},

	tabs: {
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

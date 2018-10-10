/**
 * Internal dependencies
 */
import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';

/**
 * Creates the action for a new repeater row.
 *
 * @param {string} name      The name of the repeater field.
 * @param {Array}  path      The data path of the field.
 * @param {number} index     The index of the new group.
 * @param {string} groupType The type of the group.
 * @param {string} container An ID that should be used for the container.
 * @return {Object}
 */
export const addRepeaterRow = ( name, path, index, groupType, container ) => ( {
	type: ADD_REPEATER_ROW,
	name,
	path,
	index,
	groupType,
	container,
} );

/**
 * Generates the actionf or repeater row deletion.
 *
 * @param  {Array}  path      The path to the repeater data.
 * @param  {number} index     The index of the group.
 * @param  {string} container The ID of the row's container.
 * @return {Object}           The new action.
 */
export const deleteRepeaterRow = ( path, index, container ) => ( {
	type: DELETE_REPEATER_ROW,
	path: path.filter( ( item, i ) => i !== path.length - 1 ),
	index,
	container,
} );

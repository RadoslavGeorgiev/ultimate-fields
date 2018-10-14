/**
 * Internal dependencies
 */
import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
	INSERT_CLONED_REPEATER_ROW,
	TOGGLE_REPEATER_ROW,
} from './action-types';

/**
 * Creates the action for a new repeater row.
 *
 * @param {string}  name      The name of the repeater field.
 * @param {Array}   path      The data path of the field.
 * @param {string}  groupType The type of the group.
 * @param {string}  container An ID that should be used for the container.
 * @param {boolean} hidden    An indicator whether the group is collapsed.
 * @return {Object}
 */
export const addRepeaterRow = ( name, path, groupType, container, hidden = false ) => ( {
	type: ADD_REPEATER_ROW,
	name,
	path,
	groupType,
	container,
	hidden,
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

/**
 * Generates the action for the cloning of a repeater row (just basic data).
 * This action will only create a (blank) row and leave the initialization
 * to sub-actions that will be batched.
 *
 * @param  {string} container    The ID of the new container.
 * @param  {Array}  path         The data path of the field that the group belongs to.
 * @param  {number} index        The index of the group that is being cloned.
 * @param  {string} oldContainer The container ID of the new group.
 * @return {Object}              The new action.
 */
export const cloneRepeaterRow = ( container, path, index, oldContainer ) => ( {
	type: INSERT_CLONED_REPEATER_ROW,
	container,
	path,
	index,
	oldContainer,
} );

/**
 * Toggles the visibility of a repeater row.
 *
 * @param  {Array} path The data path of the row.
 * @return {Object}     The new action.
 */
export const toggleRepeaterRow = ( path ) => ( {
	type: TOGGLE_REPEATER_ROW,
	path,
} );

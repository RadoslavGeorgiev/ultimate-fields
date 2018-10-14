import {
	UPDATE_VALUE,
	REPLACE_STATE,
} from 'state/action-types.js';

/**
 * Generates the actions that updates a simple value.
 *
 * @param  {Array}  path  A path for the value.
 * @param  {*}      value The value to use.
 * @return {Object}       The new action.
 */
export const updateValue = ( path, value ) => ( {
	type: UPDATE_VALUE,
	path,
	value,
} );

/**
 * Replaces the state with an updated one.
 *
 * @param  {Object} newState The new state.
 * @return {Object}          The new action.
 */
export const replaceState = ( newState ) => ( {
	type: REPLACE_STATE,
	newState,
} );

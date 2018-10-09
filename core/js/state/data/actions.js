import { UPDATE_VALUE, } from 'state/action-types.js';

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

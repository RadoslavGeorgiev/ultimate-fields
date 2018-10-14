/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Checks whether a repeater group is visible or not.
 *
 * @param  {Object}  state The global Redux state.
 * @param  {Array}   path  The data path to the group.
 * @return {Boolean}
 */
export const isGroupVisible = ( state, path ) => {
	return ! get( state.data, [ ...path, '__hidden' ], false );
};

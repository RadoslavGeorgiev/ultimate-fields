import {
	CHANGE_TAB,
} from 'state/action-types';

/**
 * Changes the active tab within a path.
 *
 * @param  {string} container The unique ID of the container to set the tab for.
 * @param  {string} tab       Then name of the tab.
 * @return {Object}           The action object.
 */
export const changeTab = ( container, tab ) => ( {
	type: CHANGE_TAB,
	container,
	tab,
} );

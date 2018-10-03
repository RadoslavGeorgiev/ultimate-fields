/**
 * Changes the active tab within a path.
 * 
 * @param  {string[]} path The path of a container.
 * @param  {string}   tab  Then name of the tab.
 * @return {Object}        The action object.
 */
export const changeTab = ( path, tab ) => ( {
	type: CHANGE_TAB,
	path,
	tab,
} );

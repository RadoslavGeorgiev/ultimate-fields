/**
 * Retrieves a currently active tab.
 * 
 * @param  {Object}   state The global state.
 * @param  {string[]} path  The path for the tab.
 * @return {string}         The name of the tab.
 */
export const getTab = ( state, path ) => {
	return state.tabs[ path.join( '/' ) ];
}

/**
 * Checks whether a specific tab is active.
 * 
 * @param  {Object}   state The global state.
 * @param  {string[]} path  The path for the tab.
 * @param  {string}   tab   The name of the tab to check for.
 * @return {Boolean}
 */
export const isTabActive = ( state, path, tab ) => {
	return getTab( state, path ) === tab;
}

/**
 * Retrieves a currently active tab.
 *
 * @param  {Object} state     The global state.
 * @param  {string} container The unique ID of the container.
 * @return {string}           The name of the tab.
 */
export const getTab = ( state, container ) => {
	return state.tabs[ container ];
}

/**
 * Checks whether a specific tab is active.
 *
 * @param  {Object} state     The global state.
 * @param  {string} container The unique ID of the container.
 * @param  {string} tab       The name of the tab to check for.
 * @return {Boolean}
 */
export const isTabActive = ( state, container, tab ) => {
	return getTab( state, container ) === tab;
}

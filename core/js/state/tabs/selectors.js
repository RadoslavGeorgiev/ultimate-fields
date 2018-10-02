export const getTab = ( state, datastore ) => {
	return state.tabs[ datastore ];
}

export const isTabActive = ( state, container, tab ) => {
	return getTab( state, container ) === tab;
}

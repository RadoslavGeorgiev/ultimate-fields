import { get } from 'lodash';

export const getTab = ( state, datastore ) => {
	return get( state.tabs, datastore );
}

export const isTabActive = ( state, datastore, tab ) => {
	return getTab( state, datastore ) === tab;
}

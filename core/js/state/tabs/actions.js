import {
	CHANGE_TAB,
} from 'state/action-types';

export const changeTab = ( datastore, tab ) => ( {
	type: CHANGE_TAB,
	datastore,
	tab,
} );

import {
	CHANGE_TAB,
} from './../action-types';

export const changeTab = ( datastore, tab ) => ( {
	type: CHANGE_TAB,
	datastore,
	tab,
} );

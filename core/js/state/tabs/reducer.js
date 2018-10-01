import { set } from 'lodash';

import {
	CHANGE_TAB,
} from './../action-types';

export default function( state, action ) {
	switch ( action.type ) {
		case CHANGE_TAB:
			return Object.assign( {}, set( state, action.datastore, action.tab ) );

		default:
			return state || {};
	}
}

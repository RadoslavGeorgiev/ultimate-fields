import { set, merge } from 'lodash';

import {
	CREATE_DATASTORE,
	UPDATE_VALUE,
	CHANGE_TAB,
} from 'state/action-types';
import { TAB_KEY } from 'constants';

export default function( state, action ) {
	switch ( action.type ) {
		case CREATE_DATASTORE:
			return merge( {}, state, {
				[ action.name ]: action.data,
			} );

		case UPDATE_VALUE:
			return Object.assign( {}, set( state, action.path, action.value ) );
			
		case CHANGE_TAB:
			return Object.assign( {}, set( state, [ ...action.path, TAB_KEY ], action.tab ) );

		default:
			return state || {};
	}
}

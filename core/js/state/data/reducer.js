import { set, merge } from 'lodash';

import {
	INITIALIZE_CONTAINER,
	UPDATE_VALUE,
	CHANGE_TAB,
} from 'state/action-types';
import { TAB_KEY } from 'constants';

export default function( state, action ) {
	switch ( action.type ) {
		case INITIALIZE_CONTAINER:
			return merge( {}, state, action.data );

		case UPDATE_VALUE:
			return Object.assign( {}, set( state, action.path, action.value ) );
			
		case CHANGE_TAB:
			return Object.assign( {}, set( state, [ ...action.path, TAB_KEY ], action.tab ) );

		default:
			return state || {};
	}
}

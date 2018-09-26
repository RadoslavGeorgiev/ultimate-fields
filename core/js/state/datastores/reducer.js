import { set, merge } from 'lodash';

import {
	CREATE_DATASTORE,
	UPDATE_VALUE,
} from './../action-types.js';

export default function( state, action ) {
	switch ( action.type ) {
		case CREATE_DATASTORE:
			return merge( {}, state, {
				[ action.name ]: action.data,
			} );

		case UPDATE_VALUE:
			return Object.assign( {}, set( state, action.path, action.value ) );

		default:
			return state || {};
	}
}

import { set, merge } from 'lodash';

import createReducer from 'state/create-reducer';
import {
	INITIALIZE_CONTAINER,
	UPDATE_VALUE,
} from 'state/action-types';

export default createReducer( {}, {
	[ INITIALIZE_CONTAINER ]: ( state, { data } ) => ( {
		...state,
		...data,
	} ),

	[ UPDATE_VALUE ]: ( state, { path, value } ) => {
		const diff = set( {}, path, value );
		return merge( {}, state, diff );
	},
} );

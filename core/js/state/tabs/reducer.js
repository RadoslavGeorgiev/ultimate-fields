import { reduce, unset } from 'lodash';

import createReducer from 'state/create-reducer';
import {
	INITIALIZE_CONTAINER,
	DESTROY_CONTAINER,
	CHANGE_TAB,
} from 'state/action-types';

export default createReducer( {}, {
	[ CHANGE_TAB ]: ( state, { container, tab } ) => ( {
		...state,
		[ container ]: tab,
	} ),

	// [ INITIALIZE_CONTAINER ]: ( state, { tabs } ) => reduce(
	// 	tabs,
	// 	( result, { tab, path } ) => ( {
	// 		...result,
	// 		[ path.join( '/' ) ]: tab,
	// 	} ),
	// 	Object.assign( {}, state )
	// ),
	//
	// [ DESTROY_CONTAINER ]: ( state, { path } ) => {
	// 	const updatedState = { ...state };
	//
	// 	// Unset the tab for the container if any.
	// 	unset( updatedState, path.join( '/' ) );
	//
	// 	return updatedState;
	// },
} );

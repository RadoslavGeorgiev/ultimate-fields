/**
 * External dependencies
 */
import { isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import createReducer from 'state/create-reducer';
import {
	SET_VALIDATION_MESSAGE,
	CLEAR_VALIDATION_MESSAGE,
} from 'state/action-types';

export default createReducer( 'validation', [], {
	[ SET_VALIDATION_MESSAGE ]: ( state, { path, message } ) => ( [
		...state,
		{ path, message },
	] ),

	[ CLEAR_VALIDATION_MESSAGE ]: ( state, { path } ) => state.filter( item => {
		return ! isEqual( item.path, path );
	} ),
} );

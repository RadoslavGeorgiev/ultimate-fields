/**
 * External dependencies
 */
import { unset } from 'lodash';

/**
 * Internal dependencies
 */
import createReducer from 'state/create-reducer';
import {
	SET_VALIDATION_MESSAGE,
	CLEAR_VALIDATION_MESSAGE,
} from 'state/action-types';

export default createReducer( 'validation', {}, {
	[ SET_VALIDATION_MESSAGE ]: ( state, { path, message } ) => ( {
		...state,
		[ path.join( '/' ) ]: message,
	} ),

	[ CLEAR_VALIDATION_MESSAGE ]: ( state, { path } ) => {
		const updatedState = { ...state };
		unset( updatedState, path.join( '/' ) );
		return updatedState;
	},
} );

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import createReducer from 'state/create-reducer';
import {
	SET_ENV,
} from 'state/action-types';
import { mergeWithArrays } from 'utils';

export default createReducer( {}, {
	[ SET_ENV ]: ( state, { name, value } ) => ( {
		...state,
		[ name ]: value
	} ),
} );

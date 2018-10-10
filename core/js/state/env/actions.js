/**
 * Internal dependencies
 */
import {
	SET_ENV
} from 'state/action-types';

export const setEnv = ( name, value ) => ( {
	type: SET_ENV,
	name,
	value,
} );

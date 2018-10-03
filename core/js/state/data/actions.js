import {
	INITIALIZE_CONTAINER,
	UPDATE_VALUE,
	CHANGE_TAB,
} from 'state/action-types.js';

export const createStore = ( name, state = {} ) => ( {
	type: INITIALIZE_CONTAINER,
	name,
	...state,
} )

export const updateValue = ( path, value ) => ( {
	type: UPDATE_VALUE,
	path,
	value,
} );


import {
	CREATE_DATASTORE,
	UPDATE_VALUE,
} from './../action-types.js';

export const createDatastore = ( name, data = {} ) => ( {
	type: CREATE_DATASTORE,
	name,
	data,
} )

export const updateValue = ( path, value ) => ( {
	type: UPDATE_VALUE,
	path,
	value,
} );

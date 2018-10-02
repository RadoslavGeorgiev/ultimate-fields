import { uniqueId } from 'lodash';

import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';

export const addRepeaterRow = ( name, datastore, group ) => ( {
	type: ADD_REPEATER_ROW,
	id: uniqueId( 'group-' ),
	name,
	datastore,
	group,
} );

export const deleteRepeaterRow = ( datastore, index ) => ( {
	type: DELETE_REPEATER_ROW,
	datastore: datastore.filter( ( item, i ) => i !== datastore.length - 1 ),
	index,
} );

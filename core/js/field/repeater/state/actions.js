import { uniqueId } from 'lodash';

import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';

export const addRepeaterRow = ( name, path, group ) => ( {
	type: ADD_REPEATER_ROW,
	name,
	path,
	group,
} );

export const deleteRepeaterRow = ( path, index ) => ( {
	type: DELETE_REPEATER_ROW,
	path: path.filter( ( item, i ) => i !== path.length - 1 ),
	index,
} );

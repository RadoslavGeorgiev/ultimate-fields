import { set, get, find, update } from 'lodash';

import mergeWithArrays from 'utils/merge-with-arrays';
import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';
const reducers = {
	data: {},
	tabs: {},
}

reducers.data[ ADD_REPEATER_ROW ] = ( state, { groupType, name, path, container } ) => {
	const diff = set( {}, [ ...path, name ], [
		{
			__container: container,
			__type: groupType,
			__hidden: false,
		},
	] );

	return mergeWithArrays( state, diff );
};

reducers.data[ DELETE_REPEATER_ROW ] = ( state, action ) => {
	const { path } = action;

	const rows = get( state, path, [] );

	return {
		...set( state, path, rows.filter( ( row, i ) => i !== action.index ) )
	}
}
//
// reducers.tabs[ ADD_REPEATER_ROW ] = ( state, { container, name } ) => ( {
// 	...state,
// 	[ container ] : name,
// } );

export default reducers;

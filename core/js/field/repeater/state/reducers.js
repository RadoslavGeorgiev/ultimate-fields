import { set, get, find, update, merge } from 'lodash';

import mergeWithArrays from 'utils/merge-with-arrays';
import {
	ADD_NEW_REPEATER_GROUP,
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';
const reducers = {
	data: {},
	tabs: {},
}

reducers.data[ ADD_REPEATER_ROW ] = ( state, { groupType, name, path, container, index } ) => {
	const rows = [];

	rows[ index ] = {
		__container: container,
		__type: groupType,
		__hidden: false,
	};

	const diff = set( {}, [ ...path, name ], rows );

	return mergeWithArrays( state, diff );
};

reducers.data[ DELETE_REPEATER_ROW ] = ( state, action ) => {
	const { path } = action;

	const rows = get( state, path, [] );

	return {
		...set( state, path, rows.filter( ( row, i ) => i !== action.index ) )
	}
}

reducers.data[ ADD_NEW_REPEATER_GROUP ] = ( state, { diff: { data } } ) => mergeWithArrays( state, data );
reducers.tabs[ ADD_NEW_REPEATER_GROUP ] = ( state, { diff: { tabs } } ) => merge( {}, state, tabs );

//
// reducers.tabs[ ADD_REPEATER_ROW ] = ( state, { container, name } ) => ( {
// 	...state,
// 	[ container ] : name,
// } );

export default reducers;

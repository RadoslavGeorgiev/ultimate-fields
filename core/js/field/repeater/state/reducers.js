import { set, get, find, update } from 'lodash';

import mergeWithArrays from 'utils/merge-with-arrays';
import { loadData } from 'container';
import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';
const reducers = {
	data: {},
	tabs: {},
}

reducers.data[ ADD_REPEATER_ROW ] = ( state, { group, name, path: contextPath } ) => {
	const { id: type, fields } = group;
	
	const path    = [ ...contextPath, name ];
	const rows    = get( state, path, [] );
	const index   = rows.length;
	const subPath = [ ...path, index ];
	
	// Generate the new sub-state
	const subState = update( loadData( fields, subPath ).data, subPath, entry => ( {
		__type: type,
		__hidden: false,
		
		...entry,
	} ) );
	
	return mergeWithArrays( state, subState );
};

reducers.data[ DELETE_REPEATER_ROW ] = ( state, action ) => {
	const { path } = action;

	const rows = get( state, path, [] );

	return {
		...set( state, path, rows.filter( ( row, i ) => i !== action.index ) )
	}
}

reducers.tabs[ ADD_REPEATER_ROW ] = ( state, action ) => {
	const firstTab = find( action.group.fields, { type: 'tab' } );

	if ( ! firstTab ) {
		return state;
	}

	return {
		...state,
		[ action.id ]: firstTab.name,
	};
}

export default reducers;
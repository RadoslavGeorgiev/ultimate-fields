import { set, get, find } from 'lodash';

import { loadData } from 'container';

import {
	ADD_REPEATER_ROW,
	DELETE_REPEATER_ROW,
} from './action-types';

const addRepeaterRow = ( state, action ) => {
	const selector = [ ...action.path, action.name ];
	const rows = get( state, selector, [] );

	return {
		...set( state, selector, [
			...rows,
			loadData( action.group.fields, {
				__id: action.id,
				__type: action.group.id,
			} ),
		] ),
	};
};

const deleteRepeaterRow = ( state, action ) => {
	const { path } = action;

	const rows = get( state, path, [] );

	return {
		...set( state, path, rows.filter( ( row, i ) => i !== action.index ) )
	}
}

const addRepeaterRowTabs = ( state, action ) => {
	const firstTab = find( action.group.fields, { type: 'tab' } );

	if ( ! firstTab ) {
		return state;
	}

	return {
		...state,
		[ action.id ]: firstTab.name,
	};
}

export default {
	data: {
		[ ADD_REPEATER_ROW ]: addRepeaterRow,
		[ DELETE_REPEATER_ROW ]: deleteRepeaterRow,
	},
	tabs: {
		[ ADD_REPEATER_ROW ]: addRepeaterRowTabs,
	},
}

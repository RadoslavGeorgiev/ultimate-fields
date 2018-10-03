import { find, reduce, merge } from 'lodash';

import { TAB_KEY } from 'constants';
import { getFieldModel } from 'field/';
import { createStore, changeTab } from 'state/data/actions';

export const initializeStore = ( store, dataPath, fields, initialData ) => {
	const data = loadData( fields, dataPath, initialData );
	
	store.dispatch( createStore( dataPath[ 0 ], data ) );
}

export const loadData = ( fields, dataPath, initialData = {} ) => {
	const data = reduce( fields, ( state, field ) => {
		const model = getFieldModel( field );
		const fieldState = model.getInitialState( {
			...field,
			dataPath,
		}, initialData );
		return merge( state, fieldState );
	}, {} );
	
	const firstTab = find( fields, { type: 'tab' } );
	if ( firstTab ) {
		data.tabs = [].concat( data.tabs || [] ).concat( [
			{
				path: dataPath,
				tab: firstTab.name,
			},
		] );
	}
	
	return data;
}

export const extractDataFromState = ( state, dataPath, fields ) => {
	return reduce( fields, ( data, definition ) => {
		const field = {
			...definition,
			dataPath: [ dataPath ]
		};

		const model = getFieldModel( field );

		return {
			...data,
			...model.extractDataFromState( field, state ),
		}
	}, {} );
}

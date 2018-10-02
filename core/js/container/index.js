import { find, reduce } from 'lodash';

import { TAB_KEY } from 'constants';
import { getFieldModel } from 'field/';
import { createStore, changeTab } from 'state/data/actions';

export const initializeStore = ( store, path, fields, initialData ) => {
	const data = loadData( fields, initialData );
	
	store.dispatch( createStore( path, data ) );
}

export const loadData = ( fields, initialData = {} ) => {
	const data = reduce( fields, ( data, field ) => {
		const model = getFieldModel( field );

		return {
			...data,
			...model.getInitialData( field, data ),
		}
	}, initialData );
	
	const firstTab = find( fields, { type: 'tab' } );
	if ( firstTab ) {
		data[ TAB_KEY ] = firstTab.name;
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

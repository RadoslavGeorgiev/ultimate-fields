import { find, reduce } from 'lodash';

import { getFieldModel } from 'field/';
import { createStore, changeTab } from 'state/data/actions';

export const initializeStore = ( store, path, fields, initialData ) => {
	store.dispatch( createStore( path, loadData( fields, initialData ) ) );

	const firstTab = find( fields, { type: 'tab' } );
	if ( firstTab ) {
		store.dispatch( changeTab( [ path ], firstTab.name ) );
	}
}

export const loadData = ( fields, initialData = {} ) => {
	return reduce( fields, ( data, field ) => {
		const model = getFieldModel( field );

		return {
			...data,
			...model.getInitialData( field, data ),
		}
	}, initialData );
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

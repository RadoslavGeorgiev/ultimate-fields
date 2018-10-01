import { find, reduce } from 'lodash';

import { getFieldModel } from './../field/';
import { createDatastore } from './../state/datastores/actions';
import { changeTab } from './../state/tabs/actions';

export const initializeStore = ( store, datastore, fields, initialData ) => {
	store.dispatch( createDatastore( datastore, loadData( fields, initialData ) ) );

	const firstTab = find( fields, { type: 'tab' } );
	if ( firstTab ) {
		store.dispatch( changeTab( datastore, firstTab.name ) );
	}
}

export const loadData = ( fields, initialData ) => {
	return reduce( fields, ( data, field ) => {
		const model = getFieldModel( field );

		return {
			...data,
			...model.getInitialData( data ),
		}
	}, initialData );
}

export const extractDataFromState = ( state, datastore, fields ) => {
	return reduce( fields, ( data, field ) => {
		const model = getFieldModel( {
			...field,
			datastore: [ datastore ]
		} );

		return {
			...data,
			...model.extractDataFromState( state ),
		}
	}, {} );
}

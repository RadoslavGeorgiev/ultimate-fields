import { find, reduce, forEach } from 'lodash';

import { TAB_KEY } from 'constants';
import { getFieldModel } from 'field/';
import { createStore } from 'state/data/actions';
import { changeTab } from 'state/tabs/actions';

export const initializeStore = ( args ) => {
	const { store } = args;
	const actions = generateInitilizationActionsList( args );

	actions.forEach( action => {
		store.dispatch( action );
	} );
}

export const generateInitilizationActionsList = ( args ) => {
	const { container, dataPath, fields, data } = args;

	let actions = [];

	const firstTab = find( fields, { type: 'tab' } );
	if ( firstTab ) {
		actions.push( changeTab( container, firstTab.name ) );
	}

	forEach( fields, definition => {
		const model = getFieldModel( definition );
		const field = {
			...definition,
			dataPath,
		};

		actions = actions.concat( model.getInitialActions( field, data ) );
	} );

	return actions;
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

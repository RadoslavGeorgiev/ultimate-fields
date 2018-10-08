import React from 'react';
import ReactDOM from 'react-dom';
import { forEach } from 'lodash';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';


import reducers from './state/reducers';
import { initializeStore, extractDataFromState } from './container';
import Container from './container/component';
import defaultFields from './field/default-fields';
import { createCombinedReducer } from './field';

import styles from './../sass/ultimate-fields.scss';

// Ensure that lodash is not conflicting with underscore.js
_.noConflict();

/**
 * Ultimate Fields uses a global store that will be shared amongst
 * containers to allow for compicated top-level dependencies.
 */
const store = createStore(
	createCombinedReducer( combineReducers( reducers ) ),
	window.__REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
);

const tempStoreName = 'options';

window.UltimateFields = {
	initializeContainer( node, settings, data, callback ) {
		const { fields } = settings;

		// Prepare a container ID
		const id = `${tempStoreName}-${settings.id}`;

		// Initialize the store with the container's data
		initializeStore( {
			store,
			container: id,
			dataPath: [ tempStoreName ],
			fields,
			data,
		} );

		// Subscribe for changes
		store.subscribe( () => {
			callback( extractDataFromState( store.getState(), tempStoreName, fields ) );
		} );

		// Render the container in place
		ReactDOM.render(
			<Provider store={ store }>
				<Container
					container={ id }
					dataPath={ [ tempStoreName ] }
					{ ...settings }
				/>
			</Provider>,
			node
		);
	},

	initializeDOMContainer( id ) {
		const wrapper  = document.getElementById( id );
		const settings = JSON.parse( wrapper.children[ 0 ].innerHTML );
		const data     = JSON.parse( wrapper.nextElementSibling.value );

		this.initializeContainer( wrapper, settings, data, updatedData => {
			wrapper.nextElementSibling.value = JSON.stringify( updatedData );
		} );
	}
}

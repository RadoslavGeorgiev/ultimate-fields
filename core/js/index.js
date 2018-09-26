import React from 'react';
import ReactDOM from 'react-dom';
import { forEach } from 'lodash';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';

import reducers from './state/reducers';
import ContainerModel from './container/model';
import fields from './field/default-fields';

import styles from './../sass/ultimate-fields.scss';

// Ensure that lodash is not conflicting with underscore.js
_.noConflict();

/**
 * Ultimate Fields uses a global datastore that will be shared amongst
 * containers to allow for compicated top-level dependencies.
 */
const store = createStore(
	reducers,
	window.__REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
);

window.UltimateFields = {
	initializeContainer( id ) {
		const wrapper = document.getElementById( id );

		const data = JSON.parse( wrapper.children[ 0 ].value );
		const settings = JSON.parse( wrapper.dataset.settings );

		// Create a model and let it setup the state
		const model = new ContainerModel( settings );
		model.initializeStore( store, data );

		store.subscribe( () => {
			wrapper.children[ 0 ].value = JSON.stringify( model.extractDataFromStore( store ) );
		} );

		// Render the container in place
		const Container = model.getComponent();
		ReactDOM.render(
			<Provider store={ store }>
				<Container datastore={ [ model.getDatastore() ] }{ ...settings } />
			</Provider>,
			wrapper.children[ 1 ]
		);
	}
}

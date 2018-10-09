/**
 * External dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

/**
 * Internal dependencies
 */
import { initializeStore, extractDataFromState } from 'container';
import Container from 'container/component';
import { registerFieldType } from 'field';
import defaultFields from 'field/default-fields';
import createStore from 'state/store';

const tempStoreName = 'options';

export default class UltimateFields {
	constructor() {
		/**
		 * Register the default field types.
		 */
		defaultFields.forEach( type => {
			type( registerFieldType )
		} );
		
		/**
		 * Ultimate Fields uses a global store that will be shared amongst
		 * containers to allow for compicated top-level dependencies.
		 */
		this.store = createStore();
	}
	
	initializeContainer( node, settings, data, callback ) {
		const { fields } = settings;

		// Prepare a container ID
		const id = `${tempStoreName}-${settings.id}`;

		// Initialize the store with the container's data
		initializeStore( {
			store: this.store,
			container: id,
			dataPath: [ tempStoreName ],
			fields,
			data,
		} );

		// Subscribe for changes
		this.store.subscribe( () => {
			callback( extractDataFromState( this.store.getState(), tempStoreName, fields ) );
		} );

		// Render the container in place
		ReactDOM.render(
			<Provider store={ this.store }>
				<Container
					container={ id }
					dataPath={ [ tempStoreName ] }
					{ ...settings }
				/>
			</Provider>,
			node
		);
	}

	initializeDOMContainer( id ) {
		const wrapper  = document.getElementById( id );
		const settings = JSON.parse( wrapper.children[ 0 ].innerHTML );
		const data     = JSON.parse( wrapper.nextElementSibling.value );
		
		console.time( id );

		this.initializeContainer( wrapper, settings, data, updatedData => {
			wrapper.nextElementSibling.value = JSON.stringify( updatedData );
		} );
		
		console.timeEnd( id );
	}
}
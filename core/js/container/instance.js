/**
 * External dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { isEmpty, forEach } from 'lodash';

/**
 * Internal dependencies
 */
import { initializeStore, extractDataFromState } from 'container';
import Container from 'container/component';
import checkPostTypeRules from './../location/post-type';

/**
 * Handles individual container instances.
 */
export default class Instance {
	input = null;

	/**
	 * Starts a container within a specific DOM node.
	 *
	 * @param  {HTMLElement} node      The node where the container should appear.
	 * @param  {Object}      settings  The settings of the container.
	 * @param  {Object}      data      The initial data for the container.
	 * @param  {Object}      store     The Redux store.
	 * @param  {string}      storeName A name for the section int the store.
	 */
	constructor( node, settings, data, store, storeName ) {
		// Save everything locally
		this.node       = node;
		this.parentNode = node;
		this.settings   = settings;
		this.store      = store;
		this.storeName  = storeName;

		// Prepare a container ID
		this.id = `${this.storeName}-${this.settings.id}`;

		// Initialize the store with the container's data
		initializeStore( {
			store: this.store,
			container: this.id,
			dataPath: [ this.storeName ],
			fields: this.settings.fields,
			data,
		} );

		// Subscribe for changes
		store.subscribe( this.populateInput );
		store.subscribe( this.toggleVisibility );

		// Render the container in place
		ReactDOM.render(
			<Provider store={ this.store }>
				<Container
					container={ this.id }
					dataPath={ [ this.storeName ] }
					{ ...this.settings }
				/>
			</Provider>,
			this.node
		);
	}

	/**
	 * Assigns the instance's data to a particular input.
	 *
	 * @param {HTMLElement} input The input to populate.
	 */
	assignInput( input ) {
		this.input = input;
	}

	/**
	 * Populates the input with data if one is specified.
	 */
	populateInput = () => {
		if ( null === this.input ) {
			return;
		}

		const { fields } = this.settings;

		const data = extractDataFromState( this.store.getState(), this.storeName, fields );
		this.input.value = JSON.stringify( data );
	}

	/**
	 * Lets the instance use a specific parent node.
	 * (used for conditional logic and etc.)
	 *
	 * @param {HTMLElement} node The node to use.
	 */
	useParentNode( node ) {
		this.parentNode = node;
		this.toggleVisibility();
	}

	/**
	 * Toggles the visbility of the instance when store change.
	 */
	toggleVisibility = () => {
		const { locations } = this.settings;

		if ( isEmpty( locations ) ) {
			return;
		}

		let visible = false;
		const state = this.store.getState();

		forEach( locations, location => {
			if( checkPostTypeRules( state, location ) ) {
				visible = true;
			}
		} );

		this.parentNode.style.display = visible ? '' : 'none';
	}
}

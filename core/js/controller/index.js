/**
 * External dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from 'lodash';
import { batchActions } from 'redux-batched-actions';

/**
 * Internal dependnecies
 */
import { setEnv } from 'state/env/actions';
import Instance from 'container/instance';
import { UPDATE_VALIDATION } from 'state/action-types';
import ValidationNotice from 'controller/validation-notice';

/**
 * This class will be extended for the individual controller of
 * each location/container type and the child class will only
 * have a single instance that starts and controls instances.
 */
export default class Controller {
	instances = [];

	/**
	 * Starts the controler up.
	 *
	 * @param {Object} args  Arguments for the controller from PHP.
	 * @param {Object} store The global Redux store.
	 */
	constructor( args, store ) {
		this.args  = args;
		this.store = store;

		if ( isFunction( this.initialize ) ) {
			this.initialize();
		}
	}

	/**
	 * A shortcut that dispatches the `setEnv` action.
	 *
	 * @param {string} name  The name of the environmental variable.
	 * @param {*}      value The value.
	 */
	setEnv( name, value ) {
		this.store.dispatch( setEnv( name, value ) );
	}

	/**
	 * Listens to a particular DOM element and lets
	 * `callback` parse it's value down to an env var.
	 *
	 * @param {string}   selector The selector of the DOM element.
	 * @param {string}   varName  The name of the variable.
	 * @param {Function} callback A callback that will process the value.
	 */
	listen( selector, varName, callback ) {
		const element = document.querySelector( selector );

		if ( ! element ) {
			this.setEnv( varName, null );
			return;
		}

		const go = () => {
			this.setEnv( varName, callback( element.value, element ) );
		}

		go();
		element.addEventListener( 'change', go );
	}

	/**
	 * Generates a new primitive instance.
	 *
	 * @param  {DOMElement} wrapper   The wrapper to initialize.
	 * @param  {Object}     settings  The settings of the instance.
	 * @param  {string}     storeName The name of the store.
	 * @param  {Object}     data      The data for the instance (Optional).
	 * @return {Instance}             The new container instance.
	 */
	/* protected */ makeInstance( wrapper, settings, storeName, data = {} ) {
		const instance = new Instance( wrapper, settings, data, this.store, storeName );

		this.instances.push( instance );

		return instance;
	}

	/**
	 * Validates the values of all instances within the controller.
	 *
	 * @return {Array} A list of errors.
	 */
	validate() {
		let errors = [];

		// Trap all actions to create a batch one
		let rawErrors = [];
		const dispatch = action => {
			rawErrors.push( action );
		};

		// Combine all top-level messages
		this.instances.forEach( instance => {
			errors = errors.concat( instance.validate( dispatch ) );
		} );

		// Create the batch action
		if ( rawErrors.length > 0 ) {
			const batch = batchActions( rawErrors, UPDATE_VALIDATION );
			this.store.dispatch( batch );
		}

		return errors;
	}

	/**
	 * Renders an error message.
	 *
	 * @param {HTMLElement} node   The node where the notice should appear.
	 * @param {Array}       errors An array of basic errors.
	 */
	renderErrors( node, errors ) {
		ReactDOM.render(
			<ValidationNotice errors={ errors } />,
			node
		);
	}
}

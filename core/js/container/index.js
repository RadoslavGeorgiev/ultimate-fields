/**
 * External dependencies
 */
import { find, reduce, forEach } from 'lodash';

/**
 * Internal dependencies
 */
import { getFieldModel } from 'field/';
import { changeTab } from 'state/tabs/actions';
import { createBatch } from 'state/batch/actions';
import { INITIALIZE_CONTAINER } from 'state/action-types';

/**
 * Initializes a store with the values of a container.
 *
 * @param {Object} args.store     Redux store.
 * @param {string} args.container The ID of the container.
 * @param {Array}  args.dataPath  A data path for the container.
 * @param {Array}  args.fields    An array of fields to use.
 * @param {Object} args.data      The initial data, if any.
 */
export const initializeStore = ( args ) => {
	const { store } = args;

	// Generate all needed actions.
	const actions = generateInitilizationActionsList( args );

	// Dispatch a single actionw ith all of the changes.
	store.dispatch( createBatch( INITIALIZE_CONTAINER, actions ) );
}

/**
 * Generates the list of actions to perform in order to initialize a container.
 *
 * @param {string}    args.container The ID of the container.
 * @param {Array}     args.dataPath  A data path for the container.
 * @param {Array}     args.fields    An array of fields to use.
 * @param {Object}    args.data      The initial data, if any.
 * @return {Object[]}                A list with basic Redux actions.
 */
export const generateInitilizationActionsList = ( args ) => {
	const { container, dataPath, fields, data } = args;

	let actions = [];

	// Check for a tab (@todo: Initialize later and check dependencies)
	const firstTab = find( fields, { type: 'tab' } );
	if ( firstTab ) {
		actions.push( changeTab( container, firstTab.name ) );
	}

	// Initialize all fields
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

/**
 * Extracts the data of a container from the state.
 *
 * @param  {Object} state    The current Redux state.
 * @param  {Array}  dataPath The path of the root container values.
 * @param  {Array}  fields   The fields of the container.
 * @return {Object}          The data.
 */
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

/**
 * External dependencies
 */
import { find, reduce, forEach, isArray } from 'lodash';
import { batchActions } from 'redux-batched-actions';

/**
 * Internal dependencies
 */
import { getFieldModel } from 'field';
import { changeTab } from 'state/tabs/actions';
import { INITIALIZE_CONTAINER } from 'state/action-types';
import { ALLOW_BULK } from 'constants';

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

	if ( ALLOW_BULK ) {
		// Dispatch a single actionw ith all of the changes.
		store.dispatch( batchActions( actions, INITIALIZE_CONTAINER ) );
	} else {
		actions.forEach( store.dispatch );
	}
}

/**
 * Generates the list of actions to perform in order to initialize a container.
 *
 * @param {string}    args.container  The ID of the container.
 * @param {Array}     args.dataPath   A data path for the container.
 * @param {Array}     args.fields     An array of fields to use.
 * @param {Object}    args.data       The initial data, if any.
 * @param {Boolean}   args.ignoreTabs Whether not to switch the tabs.
 * @return {Object[]}                 A list with basic Redux actions.
 */
export const generateInitilizationActionsList = ( args ) => {
	const { container, dataPath, fields, data, ignoreTabs } = args;

	let actions = [];

	// Check for a tab (@todo: Initialize later and check dependencies)
	if ( ! ignoreTabs ) {
		const firstTab = find( fields, { type: 'tab' } );
		if ( firstTab ) {
			actions.push( changeTab( container, firstTab.name ) );
		}
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
			dataPath: isArray( dataPath ) ? dataPath : [ dataPath ]
		};

		const model = getFieldModel( field );

		return {
			...data,
			...model.extractDataFromState( field, state ),
		}
	}, {} );
}

/**
 * Generates all error messages from within a container.
 *
 * @param  {Object}   state         The global Redux state.
 * @param  {Function} dispatch      The dispatcher
 * @param  {Array}    fields        All fields from the container.
 * @param  {Array}    dataPath      The path to the data.
 * @param  {Array}    containerPath The path to the container's errors.
 * @return {Array}                  A list of errors.
 */
export const getValidationErrors = ( state, dispatch, fields, dataPath, containerPath ) => {
	const errors = [];

	forEach( fields, definition => {
		const model = getFieldModel( definition );

		const field = {
			...definition,
			dataPath,
			containerPath,
		};

		const error = model.validate( field, state, dispatch );

		if ( error ) {
			errors.push( error );
		}
	} );

	return errors;
}

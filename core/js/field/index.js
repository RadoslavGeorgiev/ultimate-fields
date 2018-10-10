/**
 * External dependencies
 */
import { forEach, isEqual, merge } from 'lodash';

/**
 * Internal dependencies
 */
import Model from 'field/model';
import Element from 'field/element';
import Input from 'field/component';

/**
 * Contain s all registered field types.
 * @type {Object}
 */
export const types = {};

/**
 * Once `getFieldType` is called, UF will assume that fields
 * have been initialized and log a warning in the console.
 * @type {Boolean}
 */
let initialized = false;

/**
 * Default configuration for each field type.
 * @type {Object}
 */
export const defaultConfig = {
	Model,
	Element,
	Input,
	reducers: {},

	// Do not touch these
	model: null,
	connectedElement: null,
	connectedInput: null,
}

/**
 * Lets field types be registered.
 *
 * @param {string} slug The type of the field.
 * @param {Object} type All of the custom type properties. @see `defaultConfig`
 */
export const registerFieldType = ( slug, type = {} ) => {
	if ( initialized ) {
		console.error( 'Ultimate Fields: Field types have already been initialized,\
		registering a new one might be unstable.' );
	}

	types[ slug ] = {
		...defaultConfig,
		...type,
	}
}

/**
 * Returns the configuration of a particular field type.
 *
 * @param  {string} type The name of the type.
 * @return {Object}      The configuration for the field or a default one.
 */
export const getFieldType = type => {
	if ( ! initialized ) {
		initialized = true;
	}

	return types[ type ] || defaultConfig;
};

/**
 * Returns an initialized field model.
 *
 * @param  {Object} field The definition of the field whose model is needed.
 * @return {Object}       The single-instnace model.
 */
export const getFieldModel = field => {
	const fieldType = getFieldType( field.type );

	if ( null === fieldType.model ) {
		fieldType.model = new fieldType.Model;
	}

	return fieldType.model;
}

/**
 * Returns the pair of components for the field.
 *
 * @param  {Object} field The definition of a field.
 * @return {Object}       A combination of an Element and an Input components.
 */
export const getFieldComponents = field => {
	const type  = getFieldType( field.type );
	const model = getFieldModel( field );

	if ( null === type.connectedElement ) {
		type.connectedElement = model.connect( type.Element );
	}

	if ( null === type.connectedInput ) {
		type.connectedInput = model.connect( type.Input );
	}

	return {
		Element: type.connectedElement,
		Input: type.connectedInput,
	};
}

/**
 * Creates a new reducer that proxies actions though reducers,
 * provided by fields before the fallback (standard one).
 *
 * @param  {Function} fallback The normal reducer.
 * @return {Function}          The enhanced reducer.
 */
export const createCombinedReducer = ( fallback ) => {
	const reducers = {};

	forEach( types, type => {
		merge( reducers, type.reducers );
	} );

	return ( state, action ) => {
		const newState = merge( {}, state );

		forEach( reducers, ( reducer, group ) => {
			if ( reducer.hasOwnProperty( action.type ) ) {
				newState[ group ] = reducer[ action.type ]( newState[ group ], action );
			}
		} );

		return isEqual( newState, state )
			? fallback( state, action )
			: newState;
	};
}

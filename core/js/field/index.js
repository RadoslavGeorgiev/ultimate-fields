import { forEach, isEqual, merge } from 'lodash';

import FieldModel from 'field/model';
import FieldElement from 'field/element';
import FieldInput from 'field/component';

const types = {};
let initialized = false;

const defaultConfig = {
	Model: FieldModel,
	Element: FieldElement,
	Input: FieldInput,
	reducers: {},

	model: null,
	connectedElement: null,
	connectedInput: null,
}

export const registerFieldType = ( slug, type = {} ) => {
	if ( initialized ) {
		console.error( 'Ultimate Fields: Field types have already been initialized, registering a new one might be unstable.' );
	}

	types[ slug ] = {
		...defaultConfig,
		...type,
	}
}

export const getFieldType = type => {
	if ( ! initialized ) {
		initialized = true;
	}

	return types[ type ] || defaultConfig;
};

export const getFieldModel = field => {
	const fieldType = getFieldType( field.type );

	if ( null === fieldType.model ) {
		fieldType.model = new fieldType.Model;
	}

	return fieldType.model;
}

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
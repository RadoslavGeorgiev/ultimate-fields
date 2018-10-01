import { isEqual } from 'lodash';

import FieldModel from './field/model';
import FieldElement from './field/element';
import FieldInput from './field/component';

const types = {};
const cache = [];

const defaultConfig = {
	Model: FieldModel,
	Element: FieldElement,
	Input: FieldInput,
}

export const registerFieldType = ( slug, type = {} ) => {
	types[ slug ] = {
		...defaultConfig,
		...type,
	}
}

export const getFieldType = type => {
	return types[ type ] || defaultConfig;
};

export const getFieldModel = field => {
	const cached = cache.find( row => isEqual( row.field, field ) );

	if ( cached ) {
		return cached.model;
	}

	const Model = getFieldType( field.type ).Model;
	const model = new Model( field );

	cache.push( {
		field,
		model,
	} );

	return model;
}

export const getFieldElement = field => {
	const model = getFieldModel( field );
	return model.connect( getFieldType( field.type ).Element );
}

export const getFieldInput = field => {
	const model = getFieldModel( field );
	return model.connect( getFieldType( field.type ).Input );
}

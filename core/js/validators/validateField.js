import getFieldType from './../fields.js';

export default function validateField( field, store, source ) {
	const type      = getFieldType( field );
	const validator = type.getValidator();
	const state     = validator( store, field, source );

	return state;
}

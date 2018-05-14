import React from 'react';
import Field from './../Field.jsx';
import Container from './../Container.jsx';
import StoreParser from './../StoreParser.js';
import validateField from './../validators/validateField.js';

export default class Complex extends Field {
	static getStores( type, field, data, source ) {
		const { name, group: { children } } = field.props;
		const parser = new StoreParser;
		return parser.prepareDataForStore( data[ name ] || {}, children, source + '_' + name );
	}

	static getDataFromState( stores, type, field, source ) {
		const { name, group: { children } } = field.props;
		const data = {};
		const parser = new StoreParser;

		data[ name ] = parser.extractDataFromState( stores, children, source + '_' + name );

		return data;
	}

	renderInput() {
		const { group, name, source } = this.props;

		if( ! group.fields.length ) {
			return <p>This field has no sub-fields.</p>
		}

		return React.createElement( Container, {
			...group,
			source: source + '_' + name,
			className: 'uf-complex-fields'
		});
	}

	static getValidator() {
		return ( store, field, source ) => {
			const { name, label, group: { children: fields } } = field.props;
			let errors   = [];

			// Validate subfields
			fields.forEach( field => {
				const state = validateField( field, store, source + '_' + name );
				errors = errors.concat( state );
			});

			return errors;
		}
	}
}

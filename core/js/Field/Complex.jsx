import React from 'react';
import Field from './../Field.jsx';
import Container from './../Container.jsx';
import StoreParser from './../StoreParser.js';

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

		return React.createElement( Container, {
			...group,
			source: source + '_' + name
		});
	}
}

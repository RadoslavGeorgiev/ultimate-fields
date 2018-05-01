import React from 'react';
import Field from './../Field.jsx';
import Container from './../Container.jsx';

export default class Complex extends Field {
	renderInput() {
		const { group, name, source } = this.props;

		return React.createElement( Container, {
			...group,
			source: source + '_' + name
		});
	}

	static getDefaultValue( props ) {
		console.log(props);
	}
}

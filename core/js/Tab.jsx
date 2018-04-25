import React from 'react';
import validateField from './validators/validateField.js';

export default class Tab extends React.Component {
	render() {
		const { children, active, prepareField } = this.props;

		if( ! active ) {
			return null;
		}

		// Check for proper child types
		return React.Children.map( children, child => {
			return prepareField( child )
		});
	}

	static getValidator = () => {
		return ( store, field, source ) => {
			let errors = [];

			React.Children.forEach( field.props.children, child => {
				errors = errors.concat( validateField( child, store, source ) );
			});

			return errors;
		}
	}
}

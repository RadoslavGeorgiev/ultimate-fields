import React from 'react';
import { connect } from 'react-redux';
import FieldWrapper from './FieldWrapper.jsx';
import genericValidator from './validators/generic.js';

let lastFieldID = 1;
const getFieldID = () => ++lastFieldID;

export default class Field extends React.Component {
	defaultProps: {
		description: '',
		width: 100
	}

	componentWillMount() {
		this.id = 'field-' + getFieldID();
	}

	render() {
		const wrapperProps = {
			...this.props,
			id: this.id
		}

		return <FieldWrapper { ...wrapperProps }>
			{ this.renderInput() }
		</FieldWrapper>
	}

	getValue() {
		const { value } = this.props;
		// return null === value ? this.getDefaultValue() : value;
		if( null === value ) {
			console.log('Something is wrong with ' + this.props.name);
		}
		return value;
	}

	renderInput() {
		return <p>Each field type must implement renderInput!</p>
	}

	static getStores( type, field, data, source ) {
		let value;

		// Prepare the value
		if( field.props.name in data ) {
			value = data[ field.props.name ];
		}

		if( null === value ) {
			value = type.getDefaultValue( field );
		}

		value = type.prepareValue( value, field );

		// Put the value into the proper store
		const stores = {};
		stores[ source ] = {};
		stores[ source ][ field.props.name ] = value;

		return stores;
	}

	static getDefaultValue( field ) {
		return field.props.default_value;
	}

	static prepareValue( value, field ) {
		return value;
	}

	static getDataFromState( stores, type, field, source ) {
		const { name } = field.props;
		const context  = stores[ source ] || {};

		// Use the single value from the context
		const data = {};
		data[ name ] = context[ name ];
		return data;
	}

	static getValidator() {
		return genericValidator;
	}
}

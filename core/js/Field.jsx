import React from 'react';
import FieldWrapper from './FieldWrapper.jsx';
import ConnectedFieldWrapper from './ConnectedFieldWrapper.jsx';
import genericValidator from './validators/generic.js';

let lastFieldID = 1;
const getFieldID = () => ++lastFieldID;

export default class Field extends React.Component {
	static defaultProps = {
		description: '',
		width: 100,
		useWrapper: true,
		useConnectedWrapper: true
	}

	componentWillMount() {
		this.id = 'field-' + getFieldID();
	}

	render() {
		const { useWrapper, useConnectedWrapper } = this.props;

		if( ! useWrapper ) {
			return this.renderInput();
		}

		const wrapperProps = {
			...this.props,
			id: this.id
		}

		const WrapperClass = useConnectedWrapper
			? ConnectedFieldWrapper
			: FieldWrapper;

		return <WrapperClass { ...wrapperProps }>
			{ this.renderInput() }
		</WrapperClass>
	}

	getValue() {
		const { value, default_value } = this.props;
		return value;
	}

	updateValue( value ) {
		const { name, onValueChanged } = this.props;

		onValueChanged( name, value );
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


		if( null === value || 'undefined' == typeof value ) {
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

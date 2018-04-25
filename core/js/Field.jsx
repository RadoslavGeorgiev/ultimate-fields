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
		this.seed();
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

	seed() {
		const { name, value, onValueChanged } = this.props;

		if( null === value ) {
			onValueChanged( name, this.getDefaultValue() );
		}
	}

	getValue() {
		const { value } = this.props;
		return null === value ? this.getDefaultValue() : value;
	}

	getDefaultValue() {
		return '';
	}

	renderInput() {
		return <p>Each field type must implement renderInput!</p>
	}

	static getValidator() {
		return genericValidator;
	}
}

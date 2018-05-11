import React from 'react';
import request from './../../PHP/request.js';
import Select from './Select.jsx';
import SelectField from './../../Field/Select.jsx';
import MultiselectField from './../../Field/Multiselect.jsx';

export default class Multiselect extends Select {
	renderPreview() {
		const { multiselect_input_type, select_orientation, select_type } = this.props.field;

		const options = this.state.optionsLoaded
		 	? this.state.optionsLoaded
			: Select.loadOptions( this.props.field );

		if( options instanceof Promise ) {
			options.then( options => {
				this.setState({
					optionsLoaded: options
				});
			});

			return <p className="uf-preview-loader">
				<span className="spinner is-active uf-preview-loader__icon" />
				<span className="uf-preview-loader__text">Loading...</span>
			</p>;
		}

		return React.createElement( MultiselectField, {
			...this.getPreviewArgs(),

			options:     options,
			input_type:  multiselect_input_type,
			orientation: select_orientation,
			value:       []
		});
	}

	/**
	 * Returns the available comparators for conditional logic.
	 */
	static getComparators() {
		return [
			{
				compare: 'NOT_NULL',
				label:   'has a checked value',
				operand: false
			},
			{
				compare: 'NULL',
				label:   'does not have a checked value',
				operand: false
			},
			{
				compare: 'CONTAINS',
				label:   'contains',
				operand: true
			},
			{
				compare: 'DOES_NOT_CONTAIN',
				label:   'does not contain',
				operand: true
			}
		];
	}

	/**
	 * Creates a view for the operand.
	 */
	static getOperand( field ) {
		const options = Select.loadOptions( field );

		if( options instanceof Promise ) {
			return <GeneratedSelect promised={ options } useWrapper={ false } />
		} else {
			return <SelectField options={ options } useWrapper={ false } />;
		}
	}
}

class GeneratedSelect extends React.Component {
	state = {
		generated: false
	}

	componentDidMount() {
		this.props.promised.then( options => {
			this.setState({ generated: options });
		});
	}

	render() {
		const { generated } = this.state;

		return generated
			? <SelectField { ...this.props } options={ generated } />
			: <p>Loading...</p>
	}
}

import React from 'react';
import Preview from './../Preview.jsx';
import NumberField from './../../Field/Number.jsx';

export default class Number extends Preview {
	renderPreview() {
		const {
			default_value_number, number_slider, number_minumum,
			number_maximum, number_step
		} = this.props.field;

		return React.createElement( NumberField, {
			...this.getPreviewArgs(),

			value:          default_value_number,
			slider_enabled: number_slider,
			minumum:        number_minumum || 1,
			maximum:        number_maximum || 100,
			step:           number_step    || 1
		});
	}

	static getComparators() {
		return [
			{
				compare: '=',
				label:   'equals',
				operand: true
			},
			{
				compare: '>',
				label:   'is greater than',
				operand: true
			},
			{
				compare: '<',
				label:   'is lesser than',
				operand: true
			},
			{
				compare: '>=',
				label:   'is greater than or equal to',
				operand: true
			},
			{
				compare: '<=',
				label:   'is lesser than or equal to',
				operand: true
			},
			{
				compare: '!=',
				label:   'is not equal to',
				operand: true
			}
		];
	}

	/**
	 * Creates a view for the operand.
	 */
	static getOperand( field ) {
		const minumum = field.number_minumum || 1;
		const maximum = field.number_maximum || 100;

		return <NumberField useWrapper={ false } minimum={ minimum } maximum={ maximum } />;
	}
}

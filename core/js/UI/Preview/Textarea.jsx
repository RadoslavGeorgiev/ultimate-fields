import React from 'react';
import Preview from './../Preview.jsx';
import TextareaField from './../../Field/Textarea.jsx';

export default class Textarea extends Preview {
	renderPreview() {
		const { default_value_textarea, rows } = this.props.field;

		return React.createElement( TextareaField, {
			...this.getPreviewArgs(),

			value: default_value_textarea || '',
			rows
		});
	}

	static getComparators() {
		return [
			{
				compare: 'NOT_NULL',
				label:   'equals true',
				operand: false
			},
			{
				compare: 'NULL',
				label:   'equals false',
				operand: false
			},
			{
				compare: '=',
				label:   'is equal to',
				operand: true
			},
			{
				compare: '!=',
				label:   'is not equal to',
				operand: true
			}
		];
	}
}

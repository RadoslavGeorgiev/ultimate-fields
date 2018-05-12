import React from 'react';
import Preview from './../Preview.jsx';
import TextField from './../../Field/Text.jsx';

export default class Text extends Preview {
	renderPreview() {
		const { default_value_text, text_attributes } = this.props.field;
		const atts = text_attributes || {}

		return React.createElement( TextField, {
			...this.getPreviewArgs(),

			value:       default_value_text,
			placeholder: atts.text_placeholder,
			prefix:      atts.prefix,
			suffix:      atts.suffix
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

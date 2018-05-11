import React from 'react';
import Preview from './../Preview.jsx';
import CheckboxField from './../../Field/Checkbox.jsx';

export default class Checkbox extends Preview {
	renderPreview() {
		const { default_value_checkbox, checkbox_text, fancy_checkbox } = this.props.field;

		return React.createElement( CheckboxField, {
			...this.getPreviewArgs(),

			text: checkbox_text || '',
			fancy: fancy_checkbox || false,
			default_value: default_value_checkbox
		});
	}

	static getComparators() {
		return [
			{
				compare: 'NOT_NULL',
				label:   'is checked',
				operand: false
			},
			{
				compare: 'NULL',
				label:   'is not checked',
				operand: false
			}
		];
	}
}

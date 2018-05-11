import React from 'react';
import Preview from './../Preview.jsx';
import PasswordField from './../../Field/Password.jsx';

export default class Password extends Preview {
	renderPreview() {
		const { default_value_password, password_attributes: atts } = this.props.field;

		return React.createElement( PasswordField, {
			...this.getPreviewArgs(),

			value:       default_value_password,
			placeholder: atts.password_placeholder,
			prefix:      atts.password_prefix,
			suffix:      atts.password_suffix
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

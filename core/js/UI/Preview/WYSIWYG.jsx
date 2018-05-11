import React from 'react';
import Preview from './../Preview.jsx';
import WYSIWYGField from './../../Field/WYSIWYG.jsx';

export default class WYSIWYG extends Preview {
	renderPreview() {
		const { default_value_wysiwyg } = this.props.field;

		return React.createElement( WYSIWYGField, {
			...this.getPreviewArgs(),

			value: default_value_wysiwyg
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

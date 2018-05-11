import React from 'react';
import Preview from './../Preview.jsx';
import FileField from './../../Field/File.jsx';

export default class File extends Preview {
	renderPreview() {
		const { default_value_file } = this.props.field;

		// @todo: Cache the default value properly

		return React.createElement( FileField, {
			...this.getPreviewArgs(),

			value: default_value_file
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

	static getOperand() {
		// @todo: Provide caching
		return <FileField useWrapper={ false } />
	}
}

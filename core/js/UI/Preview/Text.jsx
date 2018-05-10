import React from 'react';
import Preview from './../Preview.jsx';
import TextField from './../../Field/Text.jsx';

export default class Text extends Preview {
	renderPreview() {
		const { default_value_text } = this.props.field;

		return React.createElement( TextField, {
			...this.getPreviewArgs(),
			default_value: default_value_text
		});
	}
}

import React from 'react';
import WP_Object from './WP_Object.jsx';
import WPObjectsField from './../../Field/WP_Objects.jsx';

export default class WP_Objects extends WP_Object {
	renderPreview() {
		const { objects_text } = this.props.field;

		return React.createElement( WPObjectsField, {
			...this.getPreviewArgs(),

			button_text: objects_text
		});
	}
}

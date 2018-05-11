import React from 'react';
import WP_Object from './WP_Object.jsx';
import LinkField from './../../Field/Link.jsx';

export default class Link extends WP_Object {
	renderPreview() {
		const { object_text } = this.props.field;

		return React.createElement( LinkField, {
			...this.getPreviewArgs(),

			value:      { link: '', new_tab: false },
			button_text: object_text
		});
	}
}

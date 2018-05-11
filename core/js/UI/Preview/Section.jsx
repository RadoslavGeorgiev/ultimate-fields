import React from 'react';
import Preview from './../Preview.jsx';
import SectionField from './../../Field/Section.jsx';

export default class Tab extends Preview {
	renderPreview() {
		const { section_icon: icon, section_color: color } = this.props.field;

		return React.createElement( SectionField, {
			...this.getPreviewArgs(),

			color: color || 'white',
			icon:  icon ? 'dashicons ' + icon : null
		});
	}

	static canBeUsedForConditionalLogic() {
		return false;
	}
}

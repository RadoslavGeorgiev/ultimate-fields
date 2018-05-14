import React from 'react';
import Preview from './../Preview.jsx';
import RepeaterField from './../../Field/Repeater.jsx';
import Group from './../../Field/Repeater/Group.jsx';

export default class Tab extends Preview {
	renderPreview() {
		const {
			repeater_groups, repeater_labels,
			repeater_background_color: color, repeater_chooser_type
		} = this.props.field;

		// Prepare repeater props
		const background = ( '#fff' == color || '#ffffff' == color ) ? null : color;
		const labels = repeater_labels || {}

		// Prepare all individual group
		const groups = repeater_groups.map( group => {
			const { name, title, description, title_style, edit_mode, icon } = group;

			return React.createElement( Group, {
				key:  name,
				id:   name,
				type: name,

				title, description, icon
			});
		});

		// Create the element
        return React.createElement( RepeaterField, {
            ...this.getPreviewArgs(),

			value:            [],
			children:         groups,
			background:       background,
			add_text:         labels.repeater_add_text || 'Add',
			chooser_type:     repeater_chooser_type,
			placeholder_text: labels.repeater_placeholder_text || (
				1 === groups.length && 'dropdown' == repeater_chooser_type
					? uf_l10n['repeater-basic-placeholder-single']
					: uf_l10n['repeater-basic-placeholder-multiple']
			)
        });
	}
}

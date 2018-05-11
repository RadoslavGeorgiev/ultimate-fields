import React from 'react';
import PreviewButton from './PreviewButton.jsx';
import TextField from './../Field/Text.jsx';

export default class Preview extends React.Component {
	render() {
		const { name, field_width } = this.props.field;
		const { onEdit, onAddBefore, onClone, onGetId, onDelete } = this.props;

		return <div className="uf-preview" style={{ width: ( field_width || 100 ) + '%' }} data-for={ name }>
			<div className="uf-preview__overlay" onClick={ onEdit } />

			<div className="uf-preview__toolbar">
				<PreviewButton handler={ onEdit } icon="edit">Edit</PreviewButton>
				<PreviewButton handler={ onAddBefore } icon="welcome-add-page">Add field before</PreviewButton>
				<PreviewButton handler={ onClone } icon="admin-page">Clone</PreviewButton>
				<PreviewButton handler={ onGetId } icon="admin-network">Copy field ID</PreviewButton>
				<PreviewButton handler={ onDelete } icon="trash" modifier="red">Delete</PreviewButton>
			</div>

			{ this.renderPreview() }
		</div>
	}

	renderPreview() {
		const { type } = this.props.field;

		return <p className="uf-missing-preview">
			<span className="dashicons dashicons-info" />
			{ ' ' + 'Please create a preview class for the "' + type + '" field type.' }
		</p>
	}

	getPreviewArgs() {
		const { type, name, label, description } = this.props.field;

		return {
			// Field-specific data
			type,
			name,
			label,
			description,

			// Generic preview args
			description_position: 'field',
			useConnectedWrapper: false,
			layout: 'grid'
		}
	}

	onEdit() {
		const { getFieldManager } = this.props;
		const manager = getFieldManager();
		editField( manager );
	}

	onAddBefore() {
	}

	onClone() {
	}

	onGetId() {
	}

	onDelete() {
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
			}
		]
	}

	static getOperand() {
		return <TextField useWrapper={ false } />
	}
}

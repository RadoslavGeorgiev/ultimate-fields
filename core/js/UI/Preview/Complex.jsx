import React from 'react';
import Preview from './../Preview.jsx';
import ComplexField from './../../Field/Complex.jsx';
import FieldsEditor from './../FieldsEditor.jsx';

export default class Complex extends Preview {
	renderPreview() {
		// Gather all fields
		const fields = this.props.field.complex_fields.map( field => {
			const PreviewClass = FieldsEditor.getFieldPreviewClass( field )
			return <PreviewClass key={ field.name } field={ field } />
		});

		// Create the element
		// ...this.getPreviewArgs(),

		return <div className="uf-fields uf-fields--grid">
			{ fields }
		</div>
	}
}

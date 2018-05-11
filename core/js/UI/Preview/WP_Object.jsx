import React from 'react';
import Preview from './../Preview.jsx';
import WPObjectField from './../../Field/WP_Object.jsx';
import Container from './../../Container.jsx';
import FieldsEditor from './../FieldsEditor.jsx';

export default class WP_Object extends Preview {
	renderPreview() {
		const { object_text } = this.props.field;

		return React.createElement( WPObjectField, {
			...this.getPreviewArgs(),

			button_text: object_text
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

	/**
	 * Creates a view for the operand.
	 */
	static getOperand( field ) {
		// Quick & dirty: locate the nonce
		const raw         = UltimateFields.ui.getRawFields();
		const rawFields   = raw.fields;
		const objectField = rawFields[0].children.find( child => child.name === 'default_value_wp_object' );
		const nonce       = objectField.nonce;

		// Prepare the objects
		const context = FieldsEditor.contexts[ FieldsEditor.contexts.length -1 ];
		const dependantField = context.field;

		if( dependantField && dependantField.default_value_wp_object_prepared ) {
			const cached = dependantField.default_value_wp_object_prepared;

			cached.forEach( item => {
				Container.cache[ 'object_' + item.id ] = item;
			});
		}

		// @todo: use the proper caching location

		return <WPObjectField
			name={ 'default_value_wp_object' }
			nonce={ nonce }
			useWrapper={ false }
			cacheValue={ ( name, value ) => Container.cache[name]=value }
			getCachedValue={ name => Container.cache[name] }
			getContext={ () => ({ default_value_wp_object_prepared: [] }) }
		/>
	}
}

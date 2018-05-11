import React from 'react';
import _ from 'lodash';
import Preview from './../Preview.jsx';
import ImageSelectField from './../../Field/Image_Select.jsx';
import Container from './../../Container.jsx';

export default class Image_Select extends Preview {
	renderPreview() {
		const options = Image_Select.extractOptions( this.props.field );

		return React.createElement( ImageSelectField, {
			...this.getPreviewArgs(),

			options
		});
	}

	static extractOptions( field ) {
		const options = {};
		const { image_select_options } = field;

		( image_select_options || [] ).forEach( option => {
			const image = Image_Select.getImageForOption( option );

			if( ! image )
				return;

			options[ option.key ] = {
				image: image,
				label: option.label
			}
		});

		return options;
	}

	/**
	 * Returns the image for an option.
	 */
	static getImageForOption( option ) {
		var imageID = option.image, image, cached;

		// If there is no image, skip the option
		if( ! imageID )
			return false;

		// Cache files if any
		_.each( option.image_prepared, prepared => {
			Container.cache[ 'attachment-' + prepared.id ] = prepared;
		});

		// Load the files
		if ( cached = Container.cache[ 'attachment-' + imageID ] ) {
			image = cached.url;
		}

		return image;
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

	static getOperand( field ) {
		const imageOptions = Image_Select.extractOptions( field );
		const options = {};

		_.forEach( imageOptions, ( data, key ) => {
			options[ key ] = data.label;
		});

		return <ImageSelectField useWrapper={ false } options={ options } />;
	}
}

/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import FileField from 'field/file/component'
import MediaElementPlayer from 'components/media-element-player';

/**
 * Handles the input of the file field.
 */
export default class AudioField extends FileField {
    openFilePopup = () => {
        const { value } = this.props;

        this._openPopup( {
            multiple: true,
            selected: value || [],
        } );
    }

    renderPreview( files = this.props.files ) {
        return <MediaElementPlayer ids={ files.map( file => file.id ) }>
            <audio controls="controls">
                { files.map( ( { id, url } ) => {
                    return <source src={ url } key={ id } />; 
                } ) }
            </audio>
        </MediaElementPlayer>;
    }
}
/**
 * External dependencies
 */
import React, { Component } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import translate from 'utils/l10n';
import FileField from 'field/file/component'
import Button from 'components/button';

/**
 * Handles the input of the file field.
 */
export default class AudioField extends FileField {
    openFilePopup = () => {
        const { value } = this.props;

        this.openPopup( {
            multiple: true,
            selected: value || [],
        } );
    }

    renderPreview( files = this.props.files ) {
        return <audio controls="controls" ref="audioPreview" key={ files.map( f => f.id ).join( '-' ) }>
            { files.map( ( { id, url } ) => {
               return <source src={ url } key={ id } />; 
            } ) }
        </audio>;
    }

    startPlayer() {
        const { audioPreview } = this.refs;

        if ( audioPreview ) {
            jQuery( audioPreview ).mediaelementplayer();
        }
    }

    componentDidMount() {
        this.startPlayer();
    }

    componentDidUpdate() {
        this.startPlayer();
    }
}
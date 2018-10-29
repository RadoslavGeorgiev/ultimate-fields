/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import translate from 'utils/l10n';
import Button from 'components/button';
import overlay from 'components/overlay';

/**
 * Handles the input of the file field.
 */
export default class FileField extends Component {
    render() {
        const { value } = this.props;

        return value
            ? this.renderPreview()
            : this.renderButton();
        
    }

    renderPreview() {
        const { file } = this.props;
        const { thumbnail: { url, width, height } } = file.sizes;

        return <div className="uf-file">
            <span className="uf-file__preview">
                <img src={ url } alt="" width={ width } height={ height } />
            </span>

            <span className="uf-file__buttons">
                <Button icon="dashicons dashicons-edit" title={ translate( 'file-edit' ) } onClick={ this.openPopup } />

                <Button icon="dashicons dashicons-no" type="secondary" onClick={ this.clear }>
                    { translate( 'file-remove' ) }
                </Button>
            </span>
        </div>;
    }

    renderButton( stringName = 'file-select' ) {
        return <Button icon="dashicons dashicons-admin-media" onClick={ this.openPopup }>
            { translate( stringName ) }
        </Button>;
    }

    clear = () => {
        this.props.onChange( false );
    }

    openPopup = () => {
        const body = <div className="uf-file__popup" ref={ this.renderFrame } />;

        overlay.addLayer( {
			title: translate( 'file-select-popup' ),
			icon: 'dashicons dashicons-admin-media',
			body,
		} );
    }

    renderFrame = ( wrapper ) => {
        if ( ! wrapper ) {
            return;
        }
        
        const { multiple } = this.props;

        // Arguments for the media popup
        const args = {
            title:    translate( 'file-select' ),
            multiple,
            button: {
                text: translate( 'file-save' )
            },
        };

        // Set the needed file type.
        const type = this.getFileType();
        if ( type ) {
            args.library = {
                type,
            };
        }

        // Create and setup the popup
        const frame = wp.media( args );

        // Handle selection changes
        frame.state( 'library' ).on( 'select', () => {
            this.fileSelected( frame.state( 'library' ).get( 'selection' ) );
        } );

        // Load the right file when opening the frame.
        frame.on( 'open', () => {
            this.changeInitialSelection( frame );
        } );

        frame.modal.on( 'close', function() {
            overlay.popLayer();
        } );

        // Open the popup
        frame.modal.open();

        wrapper.appendChild( frame.modal.el );
        frame.modal.render();
    }

    /**
     * This is the file type that will be passed to the media popup.
     *
     * To extend the field for specific formats, change this value.
     * Can be all/image/video/audio.
     *
     * @return {string}>.
     */
    getFileType() {
        const { file_type: type } = this.props;

        if ( ! type || 'all' === type ) {
            return false;
        }

        // Split types
        return type.split( ',' );
    }

    fileSelected( selection ) {
        const { onChange, cacheFile } = this.props;

        const raw = selection.first().toJSON();

        // Cache the file and save the value
        cacheFile( raw );
        onChange( raw.id );
    }

    /**
     * Changes the selection once the popup is open.
     *
     * @param {wp.media} frame The frame that is used.
     */
    changeInitialSelection( frame ) {
        const { value } = this.props;

        // Check if there is something to select
        if( ! value ) {
            return;
        }

        // Select
        const selection = frame.state().get( 'selection' );
        const attachment = wp.media.attachment( value );
        attachment.fetch();
        selection.add( attachment ? [ attachment ] : [] );
    }
}
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
            ? this.renderFullUI()
            : this.renderButton();
        
    }

    renderFullUI() {
        const { file } = this.props;
        
        return <div className="uf-file">
            { this.renderPreview( file ) }

            <span className="uf-file__buttons">
                <Button icon="dashicons dashicons-edit" title={ translate( 'file-edit' ) } onClick={ this.openFilePopup } />

                <Button icon="dashicons dashicons-no" type="secondary" onClick={ this.clear }>
                    { translate( 'file-remove' ) }
                </Button>
            </span>
        </div>;
    }

    openFilePopup = () => {
        const { value } = this.props;

        this.openPopup( {
            multiple: false,
            selected: value ? [ value ] : [],
        } );
    }

    renderButton( stringName = 'file-select' ) {
        return <Button icon="dashicons dashicons-admin-media" onClick={ this.openFilePopup }>
            { translate( stringName ) }
        </Button>;
    }

    clear = () => {
        this.props.onChange( false );
    }

    openPopup( args ) {
        overlay.addLayer( {
			title: translate( 'file-select-popup' ),
			icon: 'dashicons dashicons-admin-media',
			body: <div className="uf-file__popup" ref={ this.renderFrame.bind( this, args ) } />,
		} );
    }

    renderFrame = ( args, wrapper ) => {
        if ( ! wrapper ) {
            return;
        }
        
        const { multiple } = args;

        // Arguments for the media popup
        const frameArgs = {
            title:    translate( 'file-select' ),
            multiple,
            button: {
                text: translate( 'file-save' )
            },
        };

        // Set the needed file type.
        const type = args.type || this.getFileType();
        if ( type ) {
            frameArgs.library = {
                type,
            };
        }

        // Create and setup the popup
        const frame = wp.media( frameArgs );

        // Handle selection changes
        frame.state( 'library' ).on( 'select', () => {
            this.fileSelected( args, frame.state( 'library' ).get( 'selection' ) );
        } );

        // Load the right file when opening the frame.
        frame.on( 'open', () => {
            this.changeInitialSelection( args, frame );
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

    fileSelected( args, selection ) {
        const { onChange, cacheFile } = this.props;
        const { multiple, fileSelected } = args;
        const selected = [];

        selection.each( item => {
            cacheFile( item.toJSON() );
            selected.push( item.get( 'id' ) );
        } );

        const callback = fileSelected || onChange;
        if ( multiple ) {
            callback( selected );
        } else {
            callback( selected.length ? selected[ 0 ] : false );
        }
    }

    /**
     * Changes the selection once the popup is open.
     *
     * @param {wp.media} frame The frame that is used.
     */
    changeInitialSelection( args, frame ) {
        const { selected } = args;
        
        const selection = frame.state().get( 'selection' );
        selected.forEach( id => {
            const attachment = wp.media.attachment( id );
            attachment.fetch();
            selection.add( attachment ? [ attachment ] : [] );
        } );
    }

    renderPreview( file = this.props.file ) {
        const { type, title, icon, sizes } = file;

        if ( 'image' === type ) {
            const size = sizes.thumbnail || sizes.full;
            const { url, width, height } = size;

            return <span className="uf-file__preview">
                <img className="uf-file__image" src={ url } alt="" width={ width } height={ height } />
            </span>;
        }
        
        return <span className="uf-file__preview">
            <img src={ icon } className="uf-file__icon" alt="" />
            <em className="uf-file__name">{ title }</em>
        </span>;
    }
}
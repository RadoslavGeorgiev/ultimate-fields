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
	/**
	 * Renders the field.
	 * 
	 * If there is a selected file, the full UI will be rendered,
	 * but if there is none, the field will only render a button.
	 */
    render() {
        const { value } = this.props;

        return value
            ? this.renderFullUI()
            : this.renderButton();
	}
	
	/**
	 * Once the component has been mounted, this fetches
	 * files from the server in order to have preview data.
	 */
	componentDidMount() {
		const { value, isLoaded, isLoading, fetchFiles } = this.props;

		if ( value && ! isLoaded && ! isLoading ) {
			fetchFiles( value );
		}
	}

	/**
	 * Renders the full UI of the field in the state when there is selection.
	 */
    renderFullUI() {
        const { file, isLoaded } = this.props;
        
        return <div className="uf-file">
			{ isLoaded
				? this.renderPreview( file )
				: this.renderPreloader()
			}

            <span className="uf-file__buttons">
                <Button
                    icon="dashicons dashicons-edit"
                    title={ translate( 'file-edit' ) }
					onClick={ this.openFilePopup }
					disabled={ ! isLoaded }
                />

                <Button icon="dashicons dashicons-no" type="secondary" onClick={ this.clear }>
                    { translate( 'file-remove' ) }
                </Button>
            </span>
        </div>;
    }

	/**
	 * Renders the preview of a file.
	 * 
	 * @param {Object} file The file whose preview should be shown.
	 * @return {Element}    A React element that should be added to the tree.
	 */
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
	
	/**
	 * Renders the preloader that is displayed while files are fetched.
	 * 
	 * @return {Element}
	 */
	renderPreloader() {
		return <span className="spinner is-active"></span>;
	}

	/**
	 * Opens the media modal as an overlay.
	 * 
	 * This is a universal method, please use and overwrite
	 * `openFilePopup` in your components.
	 * 
	 * @param {Object} args Arguments for the media modal.
	 */
    _openPopup( args ) {
        overlay.addLayer( {
			title: translate( 'file-select-popup' ),
			icon: 'dashicons dashicons-admin-media',
			body: <div className="uf-file__popup" ref={ this.renderFrame.bind( this, args ) } />,
		} );
    }
	
	/**
	 * Opens the popup for selection of a single file.
	 */
    openFilePopup = () => {
        const { value } = this.props;

        this._openPopup( {
            multiple: false,
            selected: value ? [ value ] : [],
        } );
    }

	/**
	 * Renders a file selection buton that is only used when there is no selection.
	 * 
	 * @param {string} stringName The name of the string to use.
	 * @return {Element}
	 */
    renderButton( stringName = 'file-select' ) {
        return <Button icon="dashicons dashicons-admin-media" onClick={ this.openFilePopup }>
            { translate( stringName ) }
        </Button>;
    }

	/**
	 * Clears all selected data.
	 */
    clear = () => {
        this.props.onChange( false );
    }

	/**
	 * Sets up the media modal once the overlay opens.
	 * 
	 * @param {Object}      args    Arguments for the setup.
	 * @param {HTMLElement} wrapper The div to render the media gallery in.
	 */
    renderFrame = ( args, wrapper ) => {
        if ( ! wrapper ) {
            return;
        }
        
        const { multiple } = args;

        // Arguments for the media popup
        const frameArgs = {
            title: translate( 'file-select' ),
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
     * @return {string}
     */
    getFileType() {
        const { file_type: type } = this.props;

        if ( ! type || 'all' === type ) {
            return false;
        }

        // Split types
        return type.split( ',' );
    }

	/**
	 * Handles the selection of files in the media modal.
	 * 
	 * @param {Object}              args      The arguments that are being used for the gallery.
	 * @param {Backbone.Collection} selection A collection of selected attachments.
	 */
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
     * Changes the selection in the popup once it is opened.
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
}
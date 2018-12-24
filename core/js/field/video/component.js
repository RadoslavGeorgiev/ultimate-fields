/**
 * External dependencies
 */
import React, { Component, createElement } from 'react';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import translate from 'utils/l10n';
import FileField from 'field/file/component'
import Button from 'components/button';
import MediaElementPlayer from 'components/media-element-player';

/**
 * Handles the input of the file field.
 */
export default class VideoField extends FileField {
    /**
     * Renders the full UI of the field when files have been selected.
     * 
     * @return {React.Element}
     */
    renderFullUI() {
        const { value: { poster } } = this.props;

        // Render all buttons in advance
        const selectPosterButton = createElement( Button, {
            type: 'secondary',
            icon: 'dashicons dashicons-format-image',
            className: 'uf-video__button--left',
            onClick: this.openPosterPopup,
            children: translate( poster ? 'video-change-poster' : 'video-add-poster' ),
        } );

        const removePosterButton = poster && createElement( Button, {
            icon: 'dashicons dashicons-trash',
            type: 'secondary',
            className: 'uf-video__button--left',
            onClick: this.clearPoster,
            children: translate( 'video-remove-poster' ),
        } );

        const selectVideosButton = createElement( Button, {
            icon: 'dashicons dashicons-edit',
            type: 'primary',
            className: 'uf-video__button--right',
            onClick: this.openFilePopup,
            children: translate( 'video-select-files' ),
        } );

        const clearButton = createElement( Button, {
            icon: 'dashicons dashicons-no',
            type: 'secondary',
            className: 'uf-video__button--right',
            onClick: this.clear,
            children: translate( 'clear' ),
        } );

        // Proceed with the structure
        return <div className="uf-video">
            <div className="uf-video__preview-wrapper">
                <div className="uf-video__preview">
                    { this.renderVideoPreview() }
                </div>
            </div>

            <div className="uf-video__footer">
                { selectPosterButton }
                { removePosterButton }
                { clearButton }
                { selectVideosButton }
            </div>
        </div>;
    }

    /**
     * Renders the video tag or a placeholder to display instead.
     * 
     * @return {React.Element}
     */
    renderVideoPreview() {
        const { isLoaded } = this.props;

        if ( ! isLoaded ) {
            return <p>Loading...</p>;
        }

        const {
            value: {
                poster: posterId,
                videos
            },
            files,
        } = this.props;
        
        // Locate the poster file and prepare the poster
        const posterFile = find( files, { id: posterId } );
        const poster = posterFile
            ? posterFile.url
            : null;

        // Prepare the list of sources
        const sources = videos.map( id => {
            const file = find( files, { id } );            
            return <source src={ file.url } key={ id } />
		} );
		
		// Fetch a list of IDs in order to make the player unique
		const allIds = [].concat( videos, posterId ? [ posterId ] : [] );

        return <MediaElementPlayer ids={ allIds }>
            <video controls="controls" poster={ poster } width="100%" height="100%">
                { sources }
            </video>
        </MediaElementPlayer>;
    }
    
    /**
     * Opens the popup for file/video selection.
     */
    openFilePopup = () => {
        const { value, onChange } = this.props;

        const onSelect = files => {
            onChange( {
                ...value,
                videos: ( files || [] ),
            } );
        };

        const selection = ( value && value.videos )
            ? value.videos
            : [];

        this._openPopup( {
            multiple:     true,
            selected:     selection,
            type:         'video',
            fileSelected: onSelect,
        } );
    }

    /**
     * Opens the popup for poster selection.
     */
    openPosterPopup = () => {
        const { value, onChange } = this.props;

        const onSelect = file => {
            onChange( {
                ...value,
                poster: file,
            } )
        };

        const selection = value
            ? [ value.poster ]
            : [];

        this._openPopup( {
            multiple:     false,
            selected:     selection,
            type:         'image',
            fileSelected: onSelect,
        } );
    }

    /**
     * Clears the poster.
     */
    clearPoster = () => {
        const { value, onChange } = this.props;

        onChange( {
            ...value,
            poster: false,
        } );
    }

    /**
     * Ensure everything is loaded once the field is mounted
     */
    componentDidMount() {
        const { isLoaded, filesToFetch, fetchFiles } = this.props;

        if ( isLoaded ) {
            return;
        }
        
        fetchFiles( filesToFetch );
    }
}
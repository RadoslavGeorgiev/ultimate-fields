/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { forEach } from 'lodash';

/**
 * Internal dependencies
 */
import translate from 'utils/l10n';
import FileField from 'field/file/component';
import Button from 'components/button';

/**
 * Handles the input of the file field.
 */
export default class GalleryField extends FileField {
    constructor() {
        super( ...arguments );

        this.windowResized = () => {
            this.responsive();
        }
    }

    componentDidMount() {
        window.addEventListener( 'resize', this.windowResized );
        this.windowResized();
    }

    componentDidUpdate() {
        this.windowResized();
    }
    
    componentWillUnmount() {
        window.removeEventListener( 'resize', this.windowResized );
    }

    openFilePopup = () => {
        const { value } = this.props;

        this.openPopup( {
            multiple: true,
            selected: value || [],
        } );
    }

    renderFullUI() {
        const { files, isLoaded } = this.props;

        const sortingOptions = [
            { key: '',                 label: 'gallery-order-change',    prefix: '',  },
            { key: 'title-asc',        label: 'gallery-order-title',     prefix: '&#x2193', },
            { key: 'title-desc',       label: 'gallery-order-title',     prefix: '&#x2191', },
            { key: 'filename-asc',     label: 'gallery-order-file',      prefix: '&#x2193', },
            { key: 'filename-desc',    label: 'gallery-order-file',      prefix: '&#x2191', },
            { key: 'date-asc',         label: 'gallery-order-date',      prefix: '&#x2193', },
            { key: 'date-desc',        label: 'gallery-order-date',      prefix: '&#x2191', },
            { key: 'default',          label: 'gallery-order-default',   prefix: '&#x2193', },
            { key: 'default-reversed', label: 'gallery-order-default',   prefix: '&#x2191', },
            { key: 'random',           label: 'gallery-order-randomize', prefix: '', },
        ];

        const selectOptions = sortingOptions.map( ( { key, label, prefix } ) => {
            const __html = ( prefix ? prefix + ' ' : '' ) + translate( label );

            return <option
                value={ key }
                key={ key }
                dangerouslySetInnerHTML={ { __html } }
            />;
        } );

        return <div className={ classNames( 'uf-gallery', isLoaded && 'uf-gallery--loaded' ) }>
            <div className="uf-gallery__images" ref="images">
                { files.map( this.renderGalleryItemPreview.bind( this ) ) }
            </div>

            <div className="uf-gallery__footer">
                <Button icon="dashicons dashicons-admin-media" onClick={ this.openFilePopup }>
                    { translate( 'gallery-select' ) }
                </Button>

                <Button icon="dashicons dashicons-no" type="secondary" onClick={ this.clear }>
                    { translate( 'gallery-remove' ) }
                </Button>

                <div className="uf-gallery__order">
                    <span className="dashicons dashicons-randomize"></span>

                    <select>
                        { selectOptions }
                    </select>

                    <Button type="secondary">
                        { translate( 'gallery-sort' ) }
                    </Button>
                </div>
            </div>
        </div>;
    }

    renderGalleryItemPreview( file ) {
        const { id } = file;

        return <div className="uf-gallery__image" key={ id }>
            <div className="uf-gallery__image-inside">
                { this.renderPreview( file ) }
            </div>

            <a href="#" className="button-secondary" onClick={ this.removeImage.bind( this, file ) }>
                <span className="dashicons dashicons-no" />
            </a>
        </div>;
    }

    removeImage( file, e ) {
        const { value, onChange } = this.props;
        const { id } = file;

        e.preventDefault();

        onChange( value.filter( item => {
            return item !== id;
        } ) );
    }

    clear = () => {
        this.props.onChange( [] );
    }

    responsive() {
        const { images } = this.refs;

        if ( ! images ) {
            return;
        }
        
        const PREFIX    = 'uf-gallery--columns-';
        const className = PREFIX + Math.ceil( jQuery( images ).width() / 160 );

        if( images.classList.contains( className ) ) {
            return;
        }

        // Cleanup old classes
        forEach( images.classList, existing => {
            if ( 0 === existing.indexOf( PREFIX ) ) {
                images.classList.remove( existing );
            }
        } );
        
        // Add the new class
        images.classList.add( className );
    }
}
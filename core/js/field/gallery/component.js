/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import { forEach, find, map, shuffle } from 'lodash';

/**
 * Internal dependencies
 */
import translate from 'utils/l10n';
import FileField from 'field/file/component';
import Button from 'components/button';

/**
 * Handles the input of the gallery field.
 * 
 * @todo Sortable
 */
export default class GalleryField extends FileField {
	/**
	 * When constructing the field, create callbacks.
	 */
    constructor() {
        super( ...arguments );

		// A this-ified callback for window resizing.
        this.windowResized = () => {
            this.responsive();
        }
    }

	/**
	 * Adjusts the grid once the component gets mounted.
	 */
    componentDidMount() {
		FileField.prototype.componentDidMount.apply( this );
        window.addEventListener( 'resize', this.windowResized );
		this.windowResized();
		this.sortable();
    }
	
	/**
	 * Adjusts the grid once the component gets updated.
	 */
	componentDidUpdate() {
		this.windowResized();
		this.sortable();
    }
	
	/**
	 * Removes global listeners on for resizing.
	 */
    componentWillUnmount() {
        window.removeEventListener( 'resize', this.windowResized );
    }

	/**
	 * Opens the popup for file selection.
	 */
    openFilePopup = () => {
        const { value } = this.props;

        this._openPopup( {
            multiple: true,
            selected: value || [],
        } );
    }

	/**
	 * Renders the full UI of the field.
	 * 
	 * @return {Element}
	 */
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

                    <select ref="sort">
                        { selectOptions }
                    </select>

                    <Button type="secondary" onClick={ this.onSort }>
                        { translate( 'gallery-sort' ) }
                    </Button>
                </div>
            </div>
        </div>;
	}
	
	onSort = () => {
		const { value, files, onChange } = this.props;
		const { sort: { value: order } } = this.refs;

		if ( '' === order ) {
			return;
		}

		if ( 'random' === order ) {
			return onChange( shuffle( value ) );
		}

		let field;
		let direction;
		if( order == 'default' ) {
			field     = 'menu_order';
			direction = 'asc';
		} else if( order == 'default-reversed' ) {
			field     = 'menu_order';
			direction = 'desc';
		} else {
			[ field, direction ] = order.split( '-' );
		}

		onChange( value.sort( ( a, b ) => {
			var valueA = find( files, { id: a } )[ field ],
				valueB = find( files, { id: b } )[ field ];

			if( direction == 'desc' ) {
				return valueB >= valueA ? -1 : 1;
			} else {
				return valueA >= valueB ? -1 : 1;
			}
		} ) );
	}

	/**
	 * Renders the individual preview for a gallery item.
	 * 
	 * @param {Object} file The attachment data for the preview.
	 * @return {Element}
	 */
    renderGalleryItemPreview( file ) {
        const { id } = file;

        return <div className="uf-gallery__image" key={ id } data-id={ id }>
            <div className="uf-gallery__image-inside">
                { this.renderPreview( file ) }
            </div>

            <a href="#" className="button-secondary" onClick={ this.removeImage.bind( this, file ) }>
                <span className="dashicons dashicons-no" />
            </a>
        </div>;
    }

	/**
	 * Handles the removal of selected files.
	 * 
	 * @param {Object} file The descriptor of the file that is being removed.
	 * @param {Event}  e 	An event to respond to.
	 */
    removeImage( file, e ) {
        const { value, onChange } = this.props;
        const { id } = file;

        e.preventDefault();

        onChange( value.filter( item => {
            return item !== id;
        } ) );
    }

	/**
	 * Clears the value of the field.
	 */
    clear = () => {
        this.props.onChange( [] );
    }

	/**
	 * Responds to changes in the field size and changes
	 * the sizes of all items in order to fit nicely.
	 */
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
            if ( existing && 0 === existing.indexOf( PREFIX ) ) {
                images.classList.remove( existing );
            }
        } );
        
        // Add the new class
        images.classList.add( className );
	}
	
	/**
	 * Makes the list of images sortable.
	 */
	sortable() {
		const { images } = this.refs;
		const { onChange } = this.props;

		const collectOrder = () => {
			return map( images.children, child => parseInt( child.dataset.id ) );
		}

		jQuery( this.refs.images ).sortable( {
			selector: '.uf-gallery__image',
			tolerance: 'pointer',
			stop: () => onChange( collectOrder() ),
		} );
	}
}
import React from 'react';
import Field from './../Field.jsx';
import Button from './../Button.jsx';

export default class File extends Field {
	static defaultProps = Object.assign({
		preview_size: 'thumbnail'
	}, File.defaultProps )

	static getStores( type, field, data, source ) {
		const { name } = field.props;

		const stores = Field.getStores( type, field, data, source );
		const prepared = name + '_prepared';

		if( prepared in data ) {
			stores[ source ][ prepared ] = data[ prepared ];
		}

		return stores;
	}

	componentWillMount() {
		if( ! this.getValue() ) {
			return;
		}

		const { cacheValue, getContext, source, name } = this.props;
		const context = getContext( source );

		context[ name + '_prepared' ].forEach( item => {
			cacheValue( 'attachment-' + item.id, item );
		});
	}

	renderInput() {
		const value = this.getValue();

		if( value ) {
			return this.renderPreview();
		} else {
			return this.renderButton();
		}
	}

	renderPreview() {
		const { name, preview_size, getCachedValue, onValueChanged } = this.props;
		const attachment = getCachedValue( 'attachment-' + this.getValue() );

		if( ! attachment ) {
			return null;
		}

		const thumb = attachment.sizes[ preview_size ];

		return <div className="uf-file">
			<span className="uf-file__preview">
				<img src={ thumb.url } alt="" width={ thumb.width } height={ thumb.height } />
			</span>

			<span className="uf-file__buttons">
				<Button
					title={ uf_l10n['file-edit'] }
					icon="dashicons dashicons-edit"
					onClick={ this.openPopup.bind( this ) }
				/>

				<Button
					children={ uf_l10n['file-remove'] }
					icon="dashicons dashicons-no"
					type="secondary"
					onClick={ () => onValueChanged( name, false ) }
				/>
			</span>
		</div>
	}

	renderButton() {
		return React.createElement( Button, {
			icon:     'dashicons-admin-media',
			children: uf_l10n['file-select'],
			onClick:  this.openPopup.bind( this )
		});
	}

	/**
	 * This is the file type that will be passed to the media popup.
	 *
	 * To extend the field for specific formats, change this value.
	 * Can be all/image/video/audio.
	 *
	 * @return <string>.
	 */
	getFileType() {
		let type = this.props.file_type;

		if( ! type || 'all' == type ) {
			return false;
		}

		// Split types
		type = type.split( ',' );

		return type;
	}

	openPopup() {
		const that = this;
		const { multiple } = this.props;

		// Arguments for the media popup
		const args = {
			multiple,
			title: uf_l10n['file-select'],
			button: {
				text: uf_l10n['file-save']
			}
		}

		// Set the needed file type
		const type = this.getFileType();
		if( type ) args.library = {
			type: that.getFileType()
		}

		// Create and setup the popup
		const frame = wp.media( args );

		// Handle selection changes
		frame.state( 'library' ).on( 'select', function() {
			that.fileSelected( this.get( 'selection' ) );
		});

		// Load the right file when opening the frame.
		frame.on( 'open', () => {
			this.changeSelection( frame );
		});

		// Open the popup
		frame.modal.open();

		// @todo: Restore the overlay
		// var overlay = UltimateFields.Overlay.show({
		// 	view: frame.modal,
		// 	title: 'Select file',
		// 	buttons: [],
		// 	media: true
		// });

		frame.open();

		frame.modal.on( 'close', function() {
			// overlay.removeScreen();
		})
	}

	/**
	 * Changes the selection once the popup is open.
	 *
	 * @param <wp.media> frame The frame that is used.
	 */
	changeSelection( frame ) {
		const { multiple } = this.props;
		let value = this.getValue();

		// Check if there is something to select
		if( ! value || ( 'object' == typeof value ) && ! value.length ) {
			return;
		}

		// Make sure there is an array
		if( ! multiple && 'object' != typeof value ) {
			value = [ value ];
		}

		// Select
		value.forEach( id => {
			const selection  = frame.state().get( 'selection' );
			const attachment = wp.media.attachment( id );

			attachment.fetch();
			selection.add( attachment ? [ attachment ] : [] );
		});
	}

	fileSelected( selection ) {
		const { name, multiple, onValueChanged, cacheValue } = this.props;

		if( multiple ) {
			const ids = [];

			selection.each(function( attachment ) {
				ids.push( attachment.get( 'id' ) );
				cacheValue( 'attachment-' + attachment.get( 'id' ), attachment.toJSON() );
			});

			onValueChanged( name, ids );
		} else {
			const attachment = selection.first();

			// Cache the value
			cacheValue( 'attachment-' + attachment.get( 'id' ), attachment.toJSON() );

			// Save the value
			onValueChanged( name, attachment.get( 'id' ) );
		}
	}
}

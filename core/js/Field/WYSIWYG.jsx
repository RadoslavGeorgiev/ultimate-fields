import React from 'react';
import Field from './../Field.jsx';
import Template from './../Template.jsx';

export default class WYSIWYG extends Field {
	renderInput() {
		const { name, value, rows, onValueChanged } = this.props;
		const id = this.id;

		return React.createElement( Template, {
			name:                "field/wysiwyg",
			mceID:               id,
			rows:                rows,
			loadTagFromTemplate: true,
			componentDidMount:   this.templateDidMount.bind( this )
		});
	}

	static prepareValue( value, field ) {
		return ( 'string' == typeof value )
			? value
			: '';
	}

	templateDidMount( el ) {
		const $ = jQuery;

		if( $.isReady ) {
			this.initializeEditor( el );
		} else {
			$( () => this.initializeEditor( el ) );
		}
	}

	initializeEditor( el ) {
		const { name, rows, onValueChanged } = this.props;
		const id = this.id + '_id';

		// Locate the textarea and prepare it
		const textarea = el.querySelector( 'textarea' );
		textarea.value = this.getValue();
		textarea.addEventListener( 'change', e => onValueChanged( name, textarea.value ) );

		// Initialize the editor
		const mceInit = $.extend( {}, tinyMCEPreInit.mceInit[ 'uf_dummy_editor_id' ], {
			body_class: id,
			elements: id,
			rows: rows || 10,
			selector: '#' + id
		});

		// Setup TinyMCE if available
		if( 'undefined' != typeof tinymce ) {
			tinyMCEPreInit.mceInit[ id ] = $.extend( {}, mceInit );
			tinyMCEPreInit.mceInit[ id ].setup = editor => {
				editor.on( 'change', function( e ) {
					var value = editor.getContent();

					// Fix empty paragraphs before un-wpautop
					value = value.replace( /<p>(?:<br ?\/?>|\u00a0|\uFEFF| )*<\/p>/g, '<p>&nbsp;</p>' );

					// Remove paragraphs
					value = switchEditors._wp_Nop( value );

					onValueChanged( name, value );
				});
			}

			tinymce.init( tinyMCEPreInit.mceInit[ id ] );
		}

		// Setup quicktags
		var qtInit = $.extend( {}, tinyMCEPreInit.qtInit[ 'uf_dummy_editor_id' ], {
			id: id
		});
		tinyMCEPreInit.qtInit[ id ] = $.extend( {}, qtInit );
		quicktags( tinyMCEPreInit.qtInit[ id ] );

		// Init QuickTags
		QTags._buttonsInit();

		// Indicate tha there is no active editor
		if ( ! window.wpActiveEditor ) {
			window.wpActiveEditor = this.id;
		}
	}
}

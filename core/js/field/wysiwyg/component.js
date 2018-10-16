/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Template from 'components/template';

export default class WYSIWYG extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		rows: PropTypes.number,
		value: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
	}

	render() {
		const { name, value, rows, onChange } = this.props;
		const id = this.id;

		return <Template
			name="field/wysiwyg"
			mceID={ id }
			rows={ rows }
			loadTagFromTemplate={ true }
			componentDidMount={ this.templateDidMount }
		/>
	}

	/**
	 * Maybe starts the editor once in DOM.
	 *
	 * @param {HTMLElement} el The node.
	 */
	templateDidMount = ( el ) => {
		const $ = jQuery;

		if( $.isReady ) {
			this.initializeEditor( el );
		} else {
			$( () => this.initializeEditor( el ) );
		}
	}

	/**
	 * Initializes the editor.
	 *
	 * @param {HTMLElement} el The editor node.
	 */
	initializeEditor( el ) {
		const { name, rows, value, onChange } = this.props;
		const id = this.id + '_id';

		// Locate the textarea and prepare it
		const textarea = el.querySelector( 'textarea' );
		textarea.value = value;
		textarea.addEventListener( 'change', e => onChange( textarea.value ) );

		// Initialize the editor
		const mceInit = {
			...tinyMCEPreInit.mceInit.uf_dummy_editor_id,
			body_class: id,
			elements: id,
			rows: rows || 10,
			selector: '#' + id,
		};

		// Setup TinyMCE if available
		if( 'undefined' != typeof tinymce ) {
			tinyMCEPreInit.mceInit[ id ] = Object.assign( {}, mceInit );

			// Add a setup callback, which will start listening for changes
			tinyMCEPreInit.mceInit[ id ].setup = editor => this.setupEditor( editor );

			tinymce.init( tinyMCEPreInit.mceInit[ id ] );
		}

		// Setup quicktags
		tinyMCEPreInit.qtInit[ id ] = Object.assign( {}, tinyMCEPreInit.qtInit.uf_dummy_editor_id, {
			id: id
		});

		quicktags( tinyMCEPreInit.qtInit[ id ] );

		// Init QuickTags
		QTags._buttonsInit();

		// Indicate tha there is no active editor
		if ( ! window.wpActiveEditor ) {
			window.wpActiveEditor = this.id;
		}
	}

	/**
	 * Adds listeners once the editor has been set up.
	 *
	 * @param {Object} editor The TinyMCE editor.
	 */
	setupEditor( editor ) {
		editor.on( 'change', this.onEditorChanged.bind( this, editor ) );
	}

	/**
	 * Handles TinyMCE changes.
	 *
	 * @param {Object} editor The instance of the editor.
	 * @param {Event} e       The event that occured.
	 */
	onEditorChanged( editor, e ) {
		const { name, onChange } = this.props;

		let value = editor.getContent();

		// Fix empty paragraphs before un-wpautop
		value = value.replace( /<p>(?:<br ?\/?>|\u00a0|\uFEFF| )*<\/p>/g, '<p>&nbsp;</p>' );

		// Remove paragraphs
		value = switchEditors._wp_Nop( value );

		onChange( value );
	}
}

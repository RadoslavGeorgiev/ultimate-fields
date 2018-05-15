import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import Overlay from './../Overlay.jsx';
import Button from './../Button.jsx';
import Preview from './Preview.jsx';
import Container from './../Container.jsx';
import StoreParser from './../StoreParser.js';
import reducers from './reducers.js';

import TabPreview from './Preview/Tab.jsx';
import SectionPreview from './Preview/Section.jsx';

import TextPreview from './Preview/Text.jsx';
import PasswordPreview from './Preview/Password.jsx';
import NumberPreview from './Preview/Number.jsx';
import TextareaPreview from './Preview/Textarea.jsx';
import WYSIWYGPreview from './Preview/WYSIWYG.jsx';

import CheckboxPreview from './Preview/Checkbox.jsx';
import SelectPreview from './Preview/Select.jsx';
import MultiselectPreview from './Preview/Multiselect.jsx';
import ImageSelectPreview from './Preview/Image_Select.jsx';

import FilePreview from './Preview/File.jsx';
import ImagePreview from './Preview/Image.jsx';

import WPObjectPreview from './Preview/WP_Object.jsx';
import WPObjectsPreview from './Preview/WP_Objects.jsx';
import LinkPreview from './Preview/Link.jsx';

import RepeaterPreview from './Preview/Repeater.jsx';
import ComplexPreview from './Preview/Complex.jsx';

export default class FieldsEditor extends React.Component {
	static contexts = [];

    render() {
		const { fields } = this.props;

        return <div className="wp-ui-highlight uf-fields-editor-wrapper">
            <div className="uf-fields-editor" ref="fields">
				{ fields.length
					? fields.map( this.getFieldPreview.bind( this ) )
					: <p className="uf-fields-loading">Your fields will appear here once you create them. You can start with the "Add Field" button below.</p>
				}
            </div>
        </div>;
    }

	static getFieldPreviewClass( field ) {
		let previewClass = Preview;

		switch( field.type ) {
			case 'Tab':         previewClass = TabPreview;      break;
			case 'Section':     previewClass = SectionPreview;  break;

			case 'Text':        previewClass = TextPreview;     break;
			case 'Password':    previewClass = PasswordPreview; break;
			case 'Number':      previewClass = NumberPreview;   break;
			case 'Textarea':    previewClass = TextareaPreview; break;
			case 'WYSIWYG':     previewClass = WYSIWYGPreview;  break;

			case 'Checkbox':    previewClass = CheckboxPreview;    break;
			case 'Select':      previewClass = SelectPreview;      break;
			case 'Multiselect': previewClass = MultiselectPreview; break;
			case 'Image_Select': previewClass = ImageSelectPreview; break;

			case 'File':  previewClass = FilePreview;  break;
			case 'Image': previewClass = ImagePreview; break;

			case 'WP_Object':  previewClass = WPObjectPreview;  break;
			case 'WP_Objects': previewClass = WPObjectsPreview; break;
			case 'Link':       previewClass = LinkPreview;      break;

			case 'Repeater':    previewClass = RepeaterPreview; break;
			case 'Complex':     previewClass = ComplexPreview; break;
		}

		return previewClass;
	}

	getFieldPreview( field ) {
		const previewClass = FieldsEditor.getFieldPreviewClass( field );

		return React.createElement( previewClass, {
			field,
			key:         field.name,
			onEdit:      () => this.onEdit( field ),
			onAddBefore: () => this.onAddBefore( field ),
			onClone:     () => this.onClone( field ),
			onGetId:     () => this.onGetId( field ),
			onDelete:    () => this.onDelete( field )
		});
	}

	componentDidMount() {
		// @todo: Cleanup
		if( false ) setTimeout(()=>{
			const field = Object.assign({}, this.props.fields[1], {
				__tab: 'conditional_logic_tab'
			})

			this.onEdit( field );
		}, 100 )

		// Start jQuery UI sortable
		const $fields = jQuery( this.refs.fields );

		$fields.sortable({
			items:  '.uf-preview',
			tolerance: 'pointer',

			// Ensures the size of the placeholder is the same as the field
			start: function( e, ui ) {
				ui.placeholder.css({
					width: parseInt( ui.helper.data( 'width' ) ) + '%',
					height: ui.helper.outerHeight()
				});
			},

			// When sorting has ended, save the sort
			stop: this.saveSort.bind( this )
		});

		if( ! FieldsEditor.contexts.length ) {
			this.isTopLevel = true;
			this.prepareContexts();
		} else {
			this.isTopLevel = false;
		}
	}

	saveSort() {
		const { fields, onChange } = this.props;

		const names = _.map( this.refs.fields.children, child => child.dataset.for );
		const sorted = names.map( name => fields.find( field => field.name === name ) );

		onChange( sorted );
	}

	openOverlay( field, args ) {
		const editorFields = UltimateFields.ui.getFields();
		const parser = new StoreParser;

		if( ! this.isTopLevel ) {
			this.prepareContexts( field );
		}

		const initialValues = parser.prepareDataForStore( field, editorFields, '__' );
		const store = createStore( combineReducers( reducers ), {
			values: initialValues
		});

		const unsubscribe = store.subscribe( () => {

		});

		const cleanup = () => {
			unsubscribe();
			FieldsEditor.contexts.pop();
		}

		const closeOverlay = () => {
			cleanup();
			Overlay.remove();
		}

		const getExtractedData = () => {
			return parser.extractDataFromState( store.getState().values, editorFields, '__' )
		};

		const onSave = () => {
			const extracted = getExtractedData();
			args.onSave( extracted );
			closeOverlay();
		}

		let closeButton;
		let icon;
		const title = args.title || 'New Field';

		if( ! _.isEmpty( field ) ) {
			const onDelete = () => {
				this.onDelete( field );
				closeOverlay();
			}

			closeButton = <Button onClick={ onDelete } type="secondary" icon="dashicons-no">Delete field</Button>
			icon = 'dashicons dashicons-edit';
		} else {
			closeButton = <Button onClick={ closeOverlay } type="secondary" icon="dashicons-no">Cancel</Button>
			icon = 'dashicons dashicons-plus';
		}

		Overlay.show(
			<React.Fragment>
				<Overlay.Title icon={ icon }>{ title }</Overlay.Title>

				<Overlay.Footer>
					<Button onClick={ onSave } icon="dashicons-category">Save</Button>
					{ closeButton }
				</Overlay.Footer>

				<Provider store={ store } onRemove={ cleanup } key={ new Date() }>
					<Container children={ editorFields } source="__" layout="rows" description_position="label" className="uf-fields--boxed" display_tabs_wrapper={ true } />
				</Provider>
			</React.Fragment>
		);
	}

	prepareContexts( field ) {
		const contexts = FieldsEditor.contexts;
		const { fields } = this.props;
		const context = { fields, field }

		if( contexts.length ) {
			context.name = contexts[ contexts.length - 1 ].field.label;
		} else {
			context.name = 'Top-level Fields';
		}

		contexts.push( context );
	}

	onEdit( field ) {
		this.openOverlay( field, {
			title: 'Edit Field',
			onSave: updatedField => {
				const { fields, onChange } = this.props;

				const updated = fields.map( existing => {
					return existing.name === field.name ? updatedField : existing;
				});

				onChange( updated );
			}
		});
	}

    addField() {
        this.openOverlay( {}, {
			title: 'New Field',
			onSave: field => {
				const { fields, onChange } = this.props;

				onChange( fields.concat([ field ]) );
			}
		})
    }

	onAddBefore( field ) {
		this.openOverlay( {}, {
			title:  'New Field',
			onSave: newField => {
				const { fields, onChange } = this.props;

				const updatedFields = [];
				fields.forEach( existing => {
					if( existing.name === field.name ) {
						updatedFields.push( newField );
					}

					updatedFields.push( existing );
				});

				onChange( updatedFields );
			}
		})
	}

	onClone( field ) {
		const cloned = Object.assign( {}, field );
		cloned.name += '_clone';

		this.openOverlay( cloned, {
			title: 'New Field',
			onSave: newField => {
				const { fields, onChange } = this.props;

				const updatedFields = [];
				fields.forEach( existing => {
					updatedFields.push( existing );

					if( existing.name === field.name ) {
						updatedFields.push( newField );
					}
				})

				onChange( updatedFields );
			}
		});
	}

	onGetId( field ) {
		prompt( 'Field name:', field.name );
	}

	onDelete( field ) {
		const { fields, onChange } = this.props;

		const filtered = fields.filter( existing => {
			return existing.name != field.name;
		});

		onChange( filtered );
	}
}

import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import Overlay from './../Overlay.jsx';
import Button from './../Button.jsx';
import Preview from './Preview.jsx';
import Container from './../Container.jsx';
import StoreParser from './../StoreParser.js';
import * as reducers from './../reducers.js';

import TextPreview from './Preview/Text.jsx';
import SelectPreview from './Preview/Select.jsx';
import WPObjectPreview from './Preview/WP_Object.jsx';

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
			case 'Text': previewClass = TextPreview; break;
			case 'Select': previewClass = SelectPreview; break;
			case 'WP_Object': previewClass = WPObjectPreview; break;
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
		const title = args.title || 'New Field';

		this.prepareContexts( field );

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

		Overlay.show(
			<React.Fragment>
				<Overlay.Title>{ title }</Overlay.Title>

				<Overlay.Footer>
					<Button onClick={ onSave }>Save</Button>
					<Button onClick={ closeOverlay }>Close</Button>
				</Overlay.Footer>

				<Provider store={ store } onRemove={ cleanup }>
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

	}

	onClone( field ) {

	}

	onGetId( field ) {

	}

	onDelete( field ) {
		const { fields, onChange } = this.props;

		const filtered = fields.filter( existing => {
			return existing.name != field.name;
		});

		onChange( filtered );
	}
}

import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Overlay from './../Overlay.jsx';
import Button from './../Button.jsx';
import Preview from './Preview.jsx';
import Container from './../Container.jsx';
import StoreParser from './../StoreParser.js';
import * as reducers from './../reducers.js';

import TextPreview from './Preview/Text.jsx';

export default class FieldsEditor extends React.Component {
	static contexts = [];

    render() {
		const { fields } = this.props;

        return <div className="wp-ui-highlight uf-fields-editor-wrapper">
            <div className="uf-fields-editor">
				{ fields.length
					? fields.map( this.getFieldPreview.bind( this ) )
					: <p className="uf-fields-loading">Your fields will appear here once you create them. You can start with the "Add Field" button below.</p>
				}
            </div>
        </div>;
    }

	getFieldPreview( field ) {
		let previewClass = Preview;

		switch( field.type ) {
			case 'Text':
				previewClass = TextPreview;
				break;
		}

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

	openOverlay( field, args ) {
		const editorFields = UltimateFields.ui.getFields();
		const parser = new StoreParser;
		const title = args.title || 'New Field';

		this.prepareContexts( field );

		const store = createStore(
			combineReducers( reducers ),
			{
				values: parser.prepareDataForStore( field, editorFields, '__' )
			}
		);

		const unsubscribe = store.subscribe( () => {
		});

		const closeOverlay = () => {
			unsubscribe();
			FieldsEditor.contexts.pop();
			Overlay.remove();
		}

		const onSave = () => {
			const extracted = parser.extractDataFromState( store.getState().values, editorFields, '__' );
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

				<Provider store={ store }>
					<Container children={ editorFields } source="__" layout="rows" description_position="label" className="uf-fields--boxed" display_tabs_wrapper={ true } />
				</Provider>
			</React.Fragment>
		);
	}

	prepareContexts( field ) {
		const contexts = FieldsEditor.contexts;
		const { fields } = this.props;
		const context = { fields }

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

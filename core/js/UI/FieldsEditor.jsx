import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Loader from './../PHP/Loader.jsx';
import StoreParser from './../StoreParser.js';
import Container from './../Container.jsx';
import Overlay from './../Overlay.jsx';
import Button from './../Button.jsx';
import * as reducers from './../reducers.js';

export default class FieldsEditor extends React.Component {
    componentWillMount() {
        const { data, children } = this.props;
		const parser = new StoreParser;

		const store = this.store = window.theLastForm = createStore(
			combineReducers( reducers ),
			{
				values: parser.prepareDataForStore( {}, this.getFields(), '__' )
			}
		);

		this.unsubscribe = store.subscribe( () => {
			const extracted = parser.extractDataFromState( store.getState().values, children, '__' );
			console.log(extracted);
		});
    }

    render() {
        return <div className="wp-ui-highlight uf-fields-editor-wrapper">
            <div className="uf-fields-editor">
                <p className="uf-fields-loading">Your fields will appear here once you create them. You can start with the "Add Field" button below.</p>
            </div>
        </div>;
    }

    addField() {
        const fields = this.getFields();
        const store = this.store;
        const checkForChanges = () => { return false }

        Overlay.show(
			<React.Fragment>
				<Overlay.Title>New field</Overlay.Title>

				<Overlay.Footer>
					<Button>Save</Button>
					<Button onClick={ Overlay.remove }>Close</Button>
				</Overlay.Footer>

				<Provider store={ store } key={ Math.random() } onLeave={ checkForChanges }>
					<Container children={ fields } source="__" layout="rows" description_position="label" className="uf-fields--boxed" />
				</Provider>
			</React.Fragment>
		);
    }

    getFields() {
        if( FieldsEditor.cachedFields ) {
            return FieldsEditor.cachedFields;
        }

        const json = document.querySelector( '.uf-field-settings' ).innerHTML;
        const data = JSON.parse( json );
        const loader = new Loader( data.fields );

        return FieldsEditor.cachedFields = loader.load();
    }
}

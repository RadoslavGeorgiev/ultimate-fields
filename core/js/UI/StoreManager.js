import { createStore, combineReducers } from 'redux';
import * as reducers from './../reducers.js';
import * as uiReducers from './reducers.js';
import StoreParser from './../StoreParser.js';

export default class StoreManager {
	store = null;
	lastFieldID = 0;
	static fields;

	static useFields( fields ) {
		StoreManager.fields = fields;
	}

	constructor( initialData ) {
		this.parser = new StoreParser;

		if( initialData ) {
			this.createStore( initialData );
		}
	}

	getStore() {
		if( this.store ) {
			return this.store;
		} else {
			return this.store = this.createStore();
		}
	}

	createStore( data ) {
		// Prepare a combination of all needed reducers
		const editorReducers = combineReducers({
			...reducers,
			...uiReducers
		});

		// Prepare all data
		const initialData = {
			fields: {
				__: []
			},
			values: {}
		};

		data.forEach( field => {
			const id = this.getFieldID();
			const subvalues = this.parser.prepareDataForStore( field, StoreManager.fields, 'field_' + id );

			initialData.fields.__.push( id );
			Object.assign( initialData.values, subvalues );
		});

		this.store = createStore( editorReducers, initialData );
	}

	getFieldID() {
		return this.lastFieldID++;
	}

	subscribe( callback ) {
		this.unsubscribe = this.getStore().subscribe( () => {
			callback( this.extractData() );
		});
	}

	extractData( externalState ) {
		const state = externalState || this.getStore().getState();
		const fields = [];
		const extract = this.parser.extractDataFromState.bind( this.parser );

		state.fields.__.forEach( id => {
			const ctx = 'field_' + id;
			const data = extract( state.values, StoreManager.fields, ctx );

			fields.push( data )
		});

		return fields;
	}

	createStoreForField( state, id ) {
		const extracted = this.parser.extractDataFromState( state.values, StoreManager.fields, 'field_' + id );
		const data = this.parser.prepareDataForStore( extracted, StoreManager.fields, '__' );
		this.store = createStore( combineReducers( reducers ), { values: data } );
	}
}

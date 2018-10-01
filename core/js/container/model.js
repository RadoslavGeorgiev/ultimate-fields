import { connect } from 'react-redux';
import { reduce, forEach, isEmpty } from 'lodash';

import { createDatastore } from './../state/datastores/actions';
import { getValue, areDependenciesMet } from './../state/datastores/selectors';
import { changeTab } from './../state/tabs/actions';
import { getTab } from './../state/tabs/selectors';
import Container from './component';
import { getFieldModel } from './../field/';

export default class ContainerModel {
	constructor( { fields } ) {
		this.tabs   = [];
		this.fields = [];

		forEach( fields, element => {
			if ( 'tab' !== element.type ) {
				return this.fields.push( element );
			}

			// Use the correct inline tab component
			if ( isEmpty( this.tabs ) ) {
				this.fields.push( {
					type: 'tabs'
				} );
			}

			this.tabs.push( element );
		} );
	}

	getDatastore() {
		return 'post_5';
	}

	getComponent() {
		return connect(
			this.mapStateToProps(),
			this.mapDispatchToProps()
		)( Container );
	}

	mapStateToProps() {
		return ( state, { datastore } ) => {
			const visibleFields = this.fields.filter( field => {
				return 'tabs' !== field.type && areDependenciesMet( state, datastore, field.dependencies );
			} ).map( field => field.name );

			return {
				tabs:          this.tabs,
				activeTab:     getTab( state, [ this.getDatastore() ] ),
				fields:        this.fields,
				visibleFields: visibleFields,
			};
		};
	}

	mapDispatchToProps() {
		return dispatch => ( {

		} );
	}

	initializeStore( store, initialData ) {
		store.dispatch( createDatastore( this.getDatastore(), this.loadData( initialData ) ) );

		if ( this.tabs.length ) {
			store.dispatch( changeTab( this.getDatastore(), this.tabs[ 0 ].name ) );
		}
	}

	loadData( initialData ) {
		return reduce( this.fields, ( data, field ) => {
			const model = getFieldModel( field );

			return {
				...data,
				...model.getInitialData( data ),
			}
		}, initialData );
	}

	extractDataFromStore( store ) {
		const state = store.getState();

		return reduce( this.fields, ( data, field ) => {
			const model = getFieldModel( {
				...field,
				datastore: [ this.getDatastore() ]
			} );

			return {
				...data,
				...model.extractDataFromState( state ),
			}
		}, {} );
	}
}

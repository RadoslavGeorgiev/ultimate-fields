import { connect } from 'react-redux';
import { reduce } from 'lodash';

import { createDatastore } from './../state/datastores/actions';
import Container from './component';
import { getFieldModel } from './../field/';

export default class ContainerModel {
	constructor( { fields } ) {
		this.fields = fields;
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
		return ( state, ownProps ) => ( {
		} );
	}

	mapDispatchToProps() {
		return dispatch => ( {

		} );
	}

	initializeStore( store, initialData ) {
		store.dispatch( createDatastore( this.getDatastore(), this.loadData( initialData ) ) );
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

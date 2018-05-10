import React from 'react';
import FieldsBox from './FieldsBox.jsx';
import ReactDOM from 'react-dom';
import Loader from './../PHP/Loader.jsx';
import StoreManager from './StoreManager.js';

export default class UI {
    constructor( element ) {
		// Start by preparing the store manager
		StoreManager.useFields( this.getFields() );

		// Create a new manager
		const data = JSON.parse( element.querySelector( 'input' ).value );

        ReactDOM.render(
            <FieldsBox data={ data } />,
            element
        );
    }

    getFields() {
        if( this.cachedFields ) {
            return this.cachedFields;
        }

        const json = document.querySelector( '.uf-field-settings' ).innerHTML;
        const data = JSON.parse( json );
        const loader = new Loader( data.fields );

        return this.cachedFields = loader.load();
    }
}

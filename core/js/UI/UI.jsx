import React from 'react';
import FieldsBox from './FieldsBox.jsx';
import ReactDOM from 'react-dom';
import Loader from './../PHP/Loader.jsx';

export default class UI {
    constructor( element ) {
		// Create a new manager
		const data = JSON.parse( element.querySelector( 'input' ).value );

        ReactDOM.render(
            <FieldsBox data={ data } />,
            element
        );
    }

	getRawFields() {
		if( this.rawFields ) {
            return this.rawFields;
        }

        const json = document.querySelector( '.uf-field-settings' ).innerHTML;
        const data = JSON.parse( json );

		return this.rawFields = data;
	}

    getFields() {
        if( this.cachedFields ) {
            return this.cachedFields;
        }

        const data = this.getRawFields();
        const loader = new Loader( data.fields );

        return this.cachedFields = loader.load();
    }
}

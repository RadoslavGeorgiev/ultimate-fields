import React from 'react';
import FieldsBox from './FieldsBox.jsx';
import ReactDOM from 'react-dom';

export default class UI {
    constructor( element ) {
        const data = JSON.parse( element.querySelector( 'input' ).value );

        ReactDOM.render(
            <FieldsBox data={ data } />,
            element
        );
    }
}

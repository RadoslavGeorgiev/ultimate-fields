import React from 'react';
import validateField from './validateField.js';

export default function validateFields( store, fields ) {
    let errors = [];

    React.Children.forEach( fields, child => {
        const state = validateField( child, store, '__' );
        errors = errors.concat( state );
    });

    return errors;
}

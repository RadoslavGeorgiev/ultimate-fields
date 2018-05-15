import React from 'react';
import Select from './Select.jsx';
import FieldsEditor from './../UI/FieldsEditor.jsx';

export default class Field_Selector extends Select {
    static defaultProps = Object.assign( {}, Select.defaultProps, {
        level: 'first'
    })

    static getOptions( props ) {
        const { level } = props;

		const contexts = FieldsEditor.contexts;
        const context  = contexts[ 'last' === level ? contexts.length - 1 : 0 ];
        const options  = {};

        _.forEach( context.fields, field => {
            options[ field.name ] = field.label;
        });

        return options;
	}

    static prepareValue( value, field ) {
		return 'string' === typeof value
            ? value
            : false;
	}
}

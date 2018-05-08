import React from 'react';
import Field from './../Field.jsx';

export default class Message extends Field {
    renderInput() {
        return null;
    }

    static getStores( type, field, data, source ) {
        return {}
    }
}

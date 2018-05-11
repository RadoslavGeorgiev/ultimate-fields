import React from 'react';
import Field from './../Field.jsx';
import FieldsEditor from './../UI/FieldsEditor.jsx';
import Button from './../Button.jsx';

export default class Fields extends Field {
    renderInput() {
        const { name, onValueChanged } = this.props;

        return <div className="uf-fields-field">
            <FieldsEditor ref="editor" fields={ this.getValue() || [] } onChange={ fields => onValueChanged( name, fields ) } />

            <div className="editor-footer">
                <Button icon="dashicons-plus" onClick={ this.addField.bind( this ) }>Add field</Button>
            </div>
        </div>
    }

    addField() {
        this.refs.editor.addField();
    }

    static getDefaultValue() {
        return [];
    }
}

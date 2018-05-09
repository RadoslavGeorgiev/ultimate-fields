import React from 'react';
import FieldsEditor from './FieldsEditor.jsx';
import Button from './../Button.jsx';

export default class FieldsBox extends React.Component {
    render() {
        const { data } = this.props;

        return <div className="postbox uf-fields-box">
    		<h2 className="hndle"><span>Fields</span></h2>

    		<FieldsEditor ref="editor" />

            <div className="uf-fields-box-footer">
                <Button icon="dashicons-plus" className="uf-add-field-button" onClick={ this.addField.bind( this ) }>Add field</Button>
        	</div>

            <input type="hidden" name="uf-group-fields" className="uf-group-fields" value={ JSON.stringify( data ) } />
    	</div>
    }

    addField() {
        this.refs.editor.addField();
    }
}

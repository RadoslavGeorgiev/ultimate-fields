import React from 'react';
import FieldsEditor from './FieldsEditor.jsx';
import Button from './../Button.jsx';

export default class FieldsBox extends React.Component {
	state = {
		fields: this.props.data
	}

    render() {
        const { fields } = this.state;

        return <div className="postbox uf-fields-box">
    		<h2 className="hndle"><span>Fields</span></h2>

    		<FieldsEditor ref="editor" fields={ fields } onChange={ fields => this.setState({ fields }) } />

            <div className="uf-fields-box-footer">
                <Button icon="dashicons-plus" className="uf-add-field-button" onClick={ this.addField.bind( this ) }>Add field</Button>
        	</div>

            <input type="hidden" name="uf-group-fields" className="uf-group-fields" value={ JSON.stringify( fields ) } />
    	</div>
    }

    addField() {
        this.refs.editor.addField();
    }
}

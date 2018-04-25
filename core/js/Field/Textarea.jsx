import React from 'react';
import Field from './../Field.jsx';

export default class Textarea extends Field {
	renderInput() {
		let { name, value, onValueChanged } = this.props;

		return <textarea
			id={ this.id }
			value={ this.getValue() }
			onChange={ e => onValueChanged( name, e.target.value ) }
			rows="7"
			className="field__input field__input--textarea"
		/>
	}
}

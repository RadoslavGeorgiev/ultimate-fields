import React from 'react';
import Field from './../Field.jsx';

export default class Text extends Field {
	renderInput() {
		const { name, value, onValueChanged } = this.props;

		return <input
			id={ this.id }
			type="text"
			value={ this.getValue() }
			onChange={ e => onValueChanged( name, e.target.value ) }
			className="field__input field__input--text"
		/>
	}
}

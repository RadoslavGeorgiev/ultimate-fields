import React from 'react';
import Text from './Text.jsx';

export default class Password extends Text {
	renderInput() {
		const { name, placeholder, onValueChanged } = this.props;

		return this.wrapInput( <input
			id={ this.id }
			type="password"
			value={ this.getValue() }
			placeholder={ placeholder }
			onChange={ e => onValueChanged( name, e.target.value ) }
			className="uf-field__input uf-field__input--text"
			ref="input"
		/> )
	}

	componentDidMount() {
		// No autocomplete for passwords
	}
}

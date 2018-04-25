import React from 'react';
import Field from './../Field.jsx';

export default class Select extends Field {
	renderInput() {
		const { name, value, children, onValueChanged } = this.props;

		return <select
			id={ this.id }
			value={ this.getValue() }
			children={children}
			onChange={ e => onValueChanged( name, e.target.value ) }
			className="field__input field__input--select"
		/>
	}
}

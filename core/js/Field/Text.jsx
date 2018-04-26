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
			className="uf-field__input uf-field__input--text"
			ref="input"
		/>
	}

	componentDidMount() {
		const { input } = this.refs;
		const { suggestions } = this.props;

		if( suggestions && suggestions.length ) {
			jQuery( input ).autocomplete({
				source: suggestions
			});
		}
	}
}

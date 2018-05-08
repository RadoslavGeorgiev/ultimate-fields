import React from 'react';
import Field from './../Field.jsx';

export default class Text extends Field {
	renderInput() {
		const { name, value, onValueChanged } = this.props;

		return this.wrapInput( <input
			id={ this.id }
			type="text"
			value={ this.getValue() }
			onChange={ e => onValueChanged( name, e.target.value ) }
			className="uf-field__input uf-field__input--text"
			ref="input"
		/> )
	}

	wrapInput( input ) {
		const { prefix, suffix } = this.props;

		return <div className="uf-basic-input">
			{ prefix && <span className="uf-field-prefix" children={ prefix } /> }
			{ input }
			{ suffix && <span className="uf-field-suffix" children={ suffix } /> }
		</div>
	}

	static prepareValue( value, field ) {
		return ( 'string' == typeof value )
			? value
			: '';
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

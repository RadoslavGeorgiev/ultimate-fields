import React from 'react';
import Field from './../Field.jsx';

export default class Checkbox extends Field {
	static getDefaultValue( props ) {
		return false;
	}

	static prepareValue( value ) {
		return !! value;
	}

	componentWillMount() {
		this.focused = false;
	}

	renderInput() {
		const { name, onValueChanged, text, fancy } = this.props;

		const checkbox = <input
			id={ this.id }
			type="checkbox"
			checked={ !! this.getValue() }
			onChange={ e => onValueChanged( name, e.target.checked ) }
			onFocus={ e => this.focused = true }
			onBlur={ e => this.focused = false }
		/>;

		if( fancy ) {
			return <label className={ 'uf-checkbox' + ( this.focused ? ' uf-checkbox--focused' : '' ) }>
				{ checkbox }

				<span className="uf-checkbox__wrap wp-ui-highlight">
					<span className="uf-checkbox__button" />
				</span>

				{ text }
			</label>
		} else {
			return <label>
				{ checkbox }
				{ text }
			</label>
		}
	}
}

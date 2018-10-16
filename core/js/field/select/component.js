/**
 * Extenral dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

/**
 * Handles the input of the select field.
 */
export default class SelectField extends Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
	}

	render() {
		const { input_type } = this.props;

		if ( 'radio' === input_type ) {
			return this.renderRadios();
		} else {
			return this.renderDropdown();
		}
	}

	renderDropdown() {
		const { value, options, onChange } = this.props;

		return <select value={ value } onChange={ ( { target: { value } } ) => onChange( value ) }>
			{ map( options, ( text, key ) => {
				return <option value={ key } key={ key }>{ text }</option>
			} ) }
		</select>;
	}

	renderRadios() {
		const { name, value, options, onChange } = this.props;

		return <ul className="uf-radio">
			{ map( options, this.renderRadioOption ) }
		</ul>
	}

	renderRadioOption = ( text, key ) => {
		const { name, value, options, onChange } = this.props;

		return <li key={ key }>
			<label>
				<input
					type="radio"
					name={ name }
					value={ key }
					checked={ value === key }
					onChange={ this.radioChanged }
				/>
				<span dangerouslySetInnerHTML={{ __html: text }} />
			</label>
		</li>;
	}

	radioChanged = ( { target: { value, checked } } ) => {
		if ( checked ) {
			this.props.onChange( value );
		}
	}
}

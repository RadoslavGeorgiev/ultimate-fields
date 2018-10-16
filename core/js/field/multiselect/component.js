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
	}

	render() {
		const { input_type } = this.props;

		// if ( 'radio' === input_type ) {
		// 	return this.renderRadios();
		// } else {
		// 	return this.renderDropdown();
		// }
		return this.renderCheckboxes();
	}

	renderCheckboxes() {
		const { name, value, options, onChange } = this.props;

		return <ul className="uf-radio">
			{ map( options, this.renderCheckboxOption ) }
		</ul>
	}

	renderCheckboxOption = ( text, key ) => {
		const { name, value, options, onChange } = this.props;

		return <li key={ key }>
			<label>
				<input
					type="checkbox"
					name={ name + '[]' }
					value={ key }
					checked={ -1 !== value.indexOf( key ) }
					onChange={ this.checkboxChanged }
				/>
				<span dangerouslySetInnerHTML={{ __html: text }} />
			</label>
		</li>;
	}

	checkboxChanged = ( { target: { value, checked } } ) => {
		const { value: existing } = this.props;

		if ( checked ) {
			this.props.onChange( [ ...existing, value ] );
		} else {
			this.props.onChange( existing.filter( i => i !== value ) );
		}
	}
}

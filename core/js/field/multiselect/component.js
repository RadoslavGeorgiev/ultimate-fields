/**
 * Extenral dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import SelectField from 'field/select/component';
import {
	MULTISELECT_INPUT_SELECT,
	MULTISELECT_INPUT_CHECKBOX,
} from './constants';

/**
 * Handles the input of the multiselect field.
 */
export default class MultiselectField extends SelectField {
	static propTypes = {
		...SelectField.propTypes,
		value: PropTypes.array.isRequired,
		input_type: PropTypes.oneOf( [
			MULTISELECT_INPUT_SELECT,
			MULTISELECT_INPUT_CHECKBOX,
		] ),
	}

	/**
	 * Renders the correct type of input.
	 * 
	 * @return {React.Element}
	 */
	render() {
		const { input_type } = this.props;

		return MULTISELECT_INPUT_CHECKBOX === input_type
			? this.renderCheckboxes()
			: this.renderDropdown();
	}

	/**
	 * Renders the input for the field as a dropdown.
	 * 
	 * @return {React.Element}
	 */
	renderDropdown() {
		const { value, options } = this.props;

		return (
			<select value={ value } multiple={ true } ref="select" onChange={ this.selectChanged }>
				{ map( options, this.renderOption ) }
			</select>
		);
	}


	/**
	 * Adds select2 to the fancy input if needed.
	 */
	componentDidMount() {
		const { onChange } = this.props;
		const { select } = this.refs;

		if ( ! select ) {
			return;
		}

		const $select = jQuery( select );
		$select.select2( {
			width: '100%',
		} );

		// Listen for jQuery changes because select2 does
		// not trigger the standard react onChange event.
		$select.on( 'change', e => {
			onChange( $select.val() );
		} );
	}

	/**
	 * Renders the multiselect as a list of checkboxes.
	 * 
	 * @return {React.Element}
	 */
	renderCheckboxes() {
		const { options, orientation } = this.props;

		return <ul className={ `uf-radio uf-radio--${orientation}` }>
			{ map( options, this.renderCheckboxOption ) }
		</ul>
	}

	/**
	 * Renders an individual checkbox option.
	 * 
	 * @param {string} text The text for the option.
	 * @param {string} key  The key of the otion.
	 * @return {React.Element}
	 */
	renderCheckboxOption = ( text, key ) => {
		const { value } = this.props;

		return (
			<li key={ key }>
				<label>
					<input
						type="checkbox"
						value={ key }
						checked={ -1 !== value.indexOf( key ) }
						onChange={ this.checkboxChanged }
					/>

					<span dangerouslySetInnerHTML={ { __html: text } } />
				</label>
			</li>
		);
	}

	/**
	 * Handles the change of a radio input.
	 * 
	 * @param {Event} e The event that just occured.
	 */
	checkboxChanged = ( { target: { value, checked } } ) => {
		const { value: existing } = this.props;

		if ( checked ) {
			this.props.onChange( [ ...existing, value ] );
		} else {
			this.props.onChange( existing.filter( i => i !== value ) );
		}
	}
}

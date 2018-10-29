/**
 * Extenral dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import {
	SELECT_ORIENTATION_HORIZONTAL,
	SELECT_ORIENTATION_VERTICAL,
	SELECT_INPUT_SELECT,
	SELECT_INPUT_RADIO,
} from './constants';

/**
 * Handles the input of the select field.
 */
export default class SelectField extends Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		options: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		orientation: PropTypes.oneOf( [
			SELECT_ORIENTATION_HORIZONTAL,
			SELECT_ORIENTATION_VERTICAL,
		] ),
		input_type: PropTypes.oneOf( [
			SELECT_INPUT_SELECT,
			SELECT_INPUT_RADIO,
		] ),
	}

	static defaultProps = {
		input_type: SELECT_INPUT_RADIO,
		orientation: SELECT_ORIENTATION_VERTICAL,
	}
	
	/**
	 * Renders the input for the field.
	 * 
	 * @return {React.Element}
	 */
	render() {
		const { input_type } = this.props;

		return ( SELECT_INPUT_RADIO === input_type )
			? this.renderRadios()
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
			<select value={ value } onChange={ this.selectChanged } ref="select">
				{ map( options, this.renderOption ) }
			</select>
		);
	}

	/**
	 * Renders an option for <select /> elements.
	 * 
	 * @param {string} text The text for the option.
	 * @param {string} key  The key of the otion.
	 * @return {React.Element}
	 */
	renderOption( text, key ) {
		return (
			<option value={ key } key={ key }>
				{ text }
			</option>
		);
	}

	/**
	 * Handles changes of the select.
	 * 
	 * @param {Event} e The event that just happened.
	 */
	selectChanged = ( e ) => {
		const { onChange } = this.props;
		const { target: { value } } = e;

		onChange( value );
	}

	/**
	 * Adds select2 to the fancy input if needed.
	 */
	componentDidMount() {
		const { use_select2 } = this.props;
		const { select } = this.refs;

		if ( ! use_select2 || ! select ) {
			return;
		}

		jQuery( select ).select2();
	}

	/**
	 * Renders the input for the field as a list of radios.
	 * 
	 * @return {React.Element}
	 */
	renderRadios() {
		const { options, orientation } = this.props;

		return (
			<ul className={ `uf-radio uf-radio--${orientation}` }>
				{ map( options, this.renderRadio ) }
			</ul>
		);
	}

	/**
	 * Renders an individual radio option.
	 * 
	 * @param {string} text The text for the option.
	 * @param {string} key  The key of the otion.
	 * @return {React.Element}
	 */
	renderRadio = ( text, key ) => {
		const { name, value, containerPath } = this.props;

		const inputName = containerPath.join( '-' ) + '-' + name;

		return (
			<li key={ key }>
				<label>
					<input
						type="radio"
						name={ inputName }
						value={ key }
						checked={ value === key }
						onChange={ this.radioChanged }
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
	radioChanged = ( { target: { value, checked } } ) => {
		const { onChange } = this.props;

		if ( checked ) {
			onChange( value );
		}
	}
}

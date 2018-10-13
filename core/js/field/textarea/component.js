/**
 * Extenral dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the input of the text field.
 *
 * @param  {Object}        props          The props for the input.
 * @param  {string}        props.value    The value of the input.
 * @param  {number}        props.rows     An amount of rows.
 * @param  {Function}      props.onChange The callback to use on change.
 * @return {React.Element}
 */
export default function TextareaField( { value, rows, onChange } ) {
	return (
		<textarea
			value={ value }
			onChange={ ( { target: { value } } ) => onChange( value ) }
			rows={ rows || 10 }
		/>
	)
}

TextareaField.propTypes = {
	value: PropTypes.string.isRequired,
	rows: PropTypes.number,
}

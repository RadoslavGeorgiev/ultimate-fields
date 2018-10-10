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
 * @param  {string}        props.prefix   An optional prefix.
 * @param  {string}        props.suffix   An optional suffix.
 * @param  {Function}      props.onChange The callback to use on change.
 * @return {React.Element}
 */
export default function TextField( { value, prefix, suffix, onChange } ) {
	return <div className="uf-basic-input">
		{ prefix && <span className="uf-field__prefix">{ prefix }</span> }
		<input
			type="text"
			value={ value }
			onChange={ ( { target: { value } } ) => onChange( value ) }
		/>
		{ suffix && <span className="uf-field__suffix">{ suffix }</span> }
	</div>
}

TextField.propTypes = {
	value: PropTypes.string.isRequired,
	prefix: PropTypes.string,
	suffix: PropTypes.string,
}

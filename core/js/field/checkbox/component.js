/**
 * External dependencies
 */
import React from 'react';

/**
 * Renders the checkbox input.
 *
 * @param  {Object}        props    The props of the input.
 * @param  {Boolean}       value    The value of the input.
 * @param  {string}        text     Some text to show next to the input.
 * @param  {Function}      onChange The main callback.
 * @return {React.Element}
 */
export default ( { value, text, onChange } ) => {
	return (
		<label>
			<input
				type="checkbox"
				checked={ value }
				onChange={ ( { target: { checked } } ) => onChange( checked ) }
			/>

			{ text }
		</label>
	);
}

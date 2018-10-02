import React from 'react';

export default ( { value, onChange } ) => {
	return <input
		type="text"
		value={ value }
		onChange={ ( { target: { value } } ) => onChange( value ) }
	/>
}

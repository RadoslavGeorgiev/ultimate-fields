import React from 'react';

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

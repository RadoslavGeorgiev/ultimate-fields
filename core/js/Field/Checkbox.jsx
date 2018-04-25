import React from 'react';
import Field from './../Field.jsx';

export default class Checkbox extends Field {
	getDefaultValue() {
		return false;
	}

	renderInput() {
		const { name, onValueChanged } = this.props;

		return <label>
			<input
				id={ this.id }
				type="checkbox"
				checked={ !! this.getValue() }
				onChange={ e => onValueChanged( name, e.target.checked ) }
			/>

			Yes
		</label>
	}
}

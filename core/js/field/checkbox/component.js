import React from 'react';

export default class CheckboxField extends React.Component {
	render() {
		const { value, text, onChange } = this.props;

		return (
			<label>
				<input type="checkbox" checked={ !! value } onChange={ e => onChange( e.target.checked ) } />
				{ text }
			</label>
		);
	}
}

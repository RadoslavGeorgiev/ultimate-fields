import React from 'react';

export default class CheckboxField extends React.Component {
	render() {
		const { value, onChange } = this.props;

		return <input type="checkbox" checked={ !! value } onChange={ e => onChange( e.target.checked ) } />;
	}
}

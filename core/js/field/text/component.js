import React from 'react';

export default class TextField extends React.Component {
	render() {
		const { value, onChange } = this.props;

		return <input type="text" value={ value } onChange={ e => onChange( e.target.value ) } />;
	}
}

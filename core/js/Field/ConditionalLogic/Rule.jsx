import React from 'react';
import Button from './../../Button.jsx';

export default class Rule extends React.Component {
	render() {
		return <div className="uf-rule">
			<div className="uf-rule__element uf-rule__field"></div>
			<div className="uf-rule__element uf-rule__comparator"></div>
			<div className="uf-rule__element uf-rule__value"></div>

			<Button className="uf-rule__remove" icon="dashicons-trash" type="secondary" />
		</div>
	}
}

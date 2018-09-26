import React from 'react';

export default class Element extends React.Component {
	render() {
		const { visible, label, children } = this.props;

		if ( ! visible ) {
			return null;
		}

		return <div className="uf-field">
			<div className="uf-field__details">
				<label className="uf-field__label">{ label }</label>
			</div>

			<div className="uf-field__input">
				{ children }
			</div>
		</div>
	}
}

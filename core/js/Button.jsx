import React from 'react';

export default class Button extends React.Component {
	render() {
		const { children, icon, className } = this.props;

		const cssClasses = [
			'button-primary',
			'uf-button'
		].concat( className || '' ).join( ' ' );

		return <button type="button" { ...this.props } className={ cssClasses }>
			{ icon && <span className={ 'uf-button__icon dashicons ' + icon } /> }
			<span className="uf-button__inside">{ children }</span>
		</button>
	}
}

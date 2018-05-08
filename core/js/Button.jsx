import React from 'react';

export default class Button extends React.Component {
	static defaultProps = {
		children: ''
	}

	render() {
		const { children: text, icon, className, type } = this.props;

		let cssClasses = [
			'button-' + ( type || 'primary' ),
			'uf-button'
		]

		if( className ) {
			cssClasses.push( className );
		}

		if( ! text.length ) {
			cssClasses.push( 'uf-button--no-text' )
		}

		cssClasses = cssClasses.join( ' ' );

		return <button type="button" { ...this.props } className={ cssClasses } onClick={ this.onClick.bind( this ) }>
			{ icon && <span className={ 'uf-button__icon dashicons ' + icon } /> }
			<span className="uf-button__inside">{ text }</span>
		</button>
	}

	onClick( e ) {
		e.preventDefault();
		this.props.onClick();
	}
}

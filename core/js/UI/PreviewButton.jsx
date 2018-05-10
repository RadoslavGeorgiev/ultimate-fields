import React from 'react';

export default class PreviewButton extends React.Component {
	render() {
		const { icon, title, handler, modifier } = this.props;

		const className = [
			'uf-preview__button',
			( modifier ? 'uf-preview__button--' + modifier : null )
		].filter( className => !! className ).join( ' ');

		return React.createElement( 'a', {
			href:      "#",
			className: className,
			onClick:   e => { e.preventDefault(); handler() },
			title:     title,
			key:       title,
			children:  <span className={ 'dashicons dashicons-' + icon } />
		});
	}
}

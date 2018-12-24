/**
 * External dependencies
 */
import React, { Component } from 'react';
import classNames from 'classnames';

export default class Item extends Component {
	render() {
		const { html, isSelected } = this.props;

		return <div
			className={ classNames( 'uf-chooser__item', isSelected && 'uf-chooser__item--selected' ) }
			dangerouslySetInnerHTML={ { __html: html } }
			onClick={ this.onClick }
		/>
	}

	onClick = ( e ) => {
		const { id, onClick } = this.props;

		e.preventDefault();
		onClick( id );
	}
}
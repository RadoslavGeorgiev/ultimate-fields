import React from 'react';

export default class Item extends React.Component {
	static defaultProps = {
		disableClicks: false
	}

	render() {
		const { id, html, selected, disabled } = this.props;

		let cssClass = 'uf-item';
		if( selected ) cssClass += ' uf-item--selected';
		if( disabled ) cssClass += ' uf-item--disabled';

		return <div className={ cssClass } onClick={ this.onClick.bind( this ) }>
			<div className="uf-item__preview" dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	}

	onClick( e ) {
		const { onSelected, id, disabled, disableClicks } = this.props;

		if( ! disableClicks ) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		e.target.blur();

		if( disabled ) {
			return;
		}

		onSelected( id );
	}
}

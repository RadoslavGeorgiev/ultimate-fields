import React from 'react';

export default class Item extends React.Component {
	static defaultProps = {
		disableClicks: false
	}

	render() {
		const { id, html, selected } = this.props;

		const cssClass = 'uf-item' + ( selected ? ' uf-item--selected' : '' );

		return <div className={ cssClass } onClick={ this.onClick.bind( this ) }>
			<div className="uf-item__preview" dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	}

	onClick( e ) {
		const { onSelected, id, disableClicks } = this.props;

		if( disableClicks ) {
			e.preventDefault();
			e.stopPropagation();
			e.target.blur();
			onSelected( id );
		}
	}
}

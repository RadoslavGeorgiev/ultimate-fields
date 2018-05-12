import React from 'react';
import Grid from './Grid.js';

export default class TabButton extends React.Component {
	render() {
		const { title, active, onClick, icon } = this.props;
		const className = 'uf-tab' + ( active ? ' uf-tab--active' : '' );

		return <a href="#" className={ className } onClick={ this.clicked.bind( this ) }>
			{ icon && <span className={ 'uf-tab__icon ' + icon } /> }
			<span className="uf-tab__text">{ title }</span>
		</a>
	}

	clicked( e ) {
		e.preventDefault();
		this.props.onClick();
	}
}

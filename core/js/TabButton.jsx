import React from 'react';

export default class TabButton extends React.Component {
	render() {
		const { title, active, onClick } = this.props;
		const className = 'tab' + ( active ? ' tab--active' : '' );

		return <a href="#" className={ className } onClick={ this.clicked.bind( this ) }>
			{ title }
		</a>
	}

	clicked( e ) {
		e.preventDefault();
		this.props.onClick();
	}
}

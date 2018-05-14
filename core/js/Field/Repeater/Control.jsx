import React from 'react';

export default class Control extends React.Component {
	render() {
		const { icon, type } = this.props;

		return <a href="#" className={ 'uf-group__control uf-group__control--' + type } onClick={ this.onClick.bind( this ) }>
			<span className={ 'dashicons dashicons-' + icon } />
		</a>
	}

	onClick( e ) {
		const { handler } = this.props;

		e.preventDefault();
		handler();
	}
}

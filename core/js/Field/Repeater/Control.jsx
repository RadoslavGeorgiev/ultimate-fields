import React from 'react';

export default class Control extends React.Component {
	render() {
		const { icon, type, handler } = this.props;

		return <a href="#" className={ 'uf-group__control uf-group__control--' + type } onClick={ handler }>
			<span className={ 'dashicons dashicons-' + icon } />
		</a>
	}
}

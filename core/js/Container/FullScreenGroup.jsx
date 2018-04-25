import React from 'react';
import Container from './../Container.jsx';

export default class FullScreenGroup extends React.Component {
	render() {
		const { title } = this.props;
		
		return <div className="popup">
			<header className="popup__header">
				<h3 className="popup__name">
					{ title }
					<button onClick={ this.save.bind( this ) }>Save</button>
					<button onClick={ this.close.bind( this ) }>Close</button>
				</h3>
			</header>

			<div className="popup__body">
				<Container { ... this.props } />
			</div>
		</div>
	}

	close( e ) {
		e.preventDefault();
		this.props.onClose();
	}

	save( e ) {
		e.preventDefault();
		this.props.onSave();
	}
}

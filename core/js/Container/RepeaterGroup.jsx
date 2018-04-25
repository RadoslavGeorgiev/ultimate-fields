import React from 'react';
import Container from './../Container.jsx';

class RepeaterGroup extends React.Component {
	render() {
		const { title, index, hidden } = this.props;

		return <div className="group" data-index={ index }>
			<header className="group__header">
				<h3 className="group__name">
					{ title }

					<button onClick={ this.editFullScreen.bind( this ) }>Full-screen</button>
					<button onClick={ this.clone.bind( this ) }>Clone</button>
					<button onClick={ this.delete.bind( this ) }>Delete</button>
					<button onClick={ this.toggle.bind( this ) }>Toggle</button>
				</h3>
			</header>

			{ ! hidden && <div className="group__body">
				<Container { ... this.props } />
			</div> }
		</div>
	}

	delete( e ) {
		e.preventDefault();
		this.props.onDelete();
	}

	clone( e ) {
		e.preventDefault();
		this.props.onClone();
	}

	editFullScreen( e ) {
		e.preventDefault();
		this.props.onFullScreen();
	}

	toggle( e ) {
		e.preventDefault();
		this.props.onToggle();
	}
}

export default RepeaterGroup;

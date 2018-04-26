import React from 'react';
import Container from './../Container.jsx';
import Control from './../GroupControl.jsx';

class RepeaterGroup extends React.Component {
	render() {
		const { title, index, hidden, icon, edit_mode, position } = this.props;

		// Callbacks
		const onClone          = this.clone.bind( this );
		const onDelete         = this.delete.bind( this );
		const onEditFullScreen = this.editFullScreen.bind( this );
		const onToggle         = this.toggle.bind( this );

		const popupIcon = 'popup' == edit_mode ? 'edit' : 'editor-expand';

		const controls = <div className="uf-group__controls">
			<Control type="clone" icon="admin-page" handler={ onClone } />
			<Control type="remove" icon="trash" handler={ onDelete } />

			{ 'inline' != edit_mode &&
				<Control type="popup" icon={ popupIcon } handler={ onEditFullScreen } /> }

			{ 'popup' != edit_mode && (
					hidden
						? <Control type="expand" icon="arrow-down" handler={ onToggle } />
						: <Control type="expand" icon="arrow-up" handler={ onToggle } />
				) }
		</div>;

		return <div className="uf-group" data-index={ index }>
			<header className="uf-group__header">
				<div className="uf-group__number">
					{ icon
						? <strong className="dashicons { icon }"></strong>
						: <strong className="uf-group-number-inside">{ position }</strong>
					}

					<span className="dashicons dashicons-sort"></span>
				</div>

				{ controls }

				<h3 className="uf-group__title">{ title }</h3>
			</header>

			{ ! hidden && <div className="uf-group__body">
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

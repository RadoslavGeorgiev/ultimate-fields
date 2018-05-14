import React from 'react';
import Container from './../../Container.jsx';
import Control from './Control.jsx';

export default class Group extends React.Component {
	render() {
		const {
			title, index, hidden, icon, edit_mode, position,
			onDelete, onToggle, onClone, onEditFullScreen
		} = this.props;

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

		return <div className={ 'uf-group' + ( hidden ? ' uf-group--hidden' : '' ) } data-index={ index }>
			<header className="uf-group__header">
				<div className="uf-group__number">
					{ icon
						? <span className="dashicons { icon }"></span>
						: <strong className="uf-group__number-inside">{ position }</strong>
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
}

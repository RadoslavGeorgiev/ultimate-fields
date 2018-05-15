import React from 'react';
import Container from './../../Container.jsx';
import Control from './Control.jsx';
import StoreParser from './../../StoreParser.js';
import getFieldType from './../../fields.js';

export default class Group extends React.Component {
	render() {
		const {
			title, icon, index, hidden, edit_mode, position, canBeDeleted, canBeCloned, invalid,
			title_background, title_color, border_color,
			onDelete, onToggle, onClone, onEditFullScreen
		} = this.props;

		const popupIcon = 'popup' == edit_mode ? 'edit' : 'editor-expand';

		// Prepare the controls
		const controls = <div className="uf-group__controls">
			{ canBeCloned ? <Control type="clone" icon="admin-page" handler={ onClone } /> : null }

			{ canBeDeleted ? <Control type="remove" icon="trash" handler={ onDelete } /> : null }

			{ 'inline' != edit_mode &&
				<Control type="popup" icon={ popupIcon } handler={ onEditFullScreen } /> }

			{ 'popup' != edit_mode && (
					hidden
						? <Control type="expand" icon="arrow-down" handler={ onToggle } />
						: <Control type="expand" icon="arrow-up" handler={ onToggle } />
				) }
		</div>;

		// Prepare the styles and classes
		const groupClass = [
			'uf-group',
			hidden               && 'uf-group--hidden',
			invalid              && 'uf-group--invalid',
			'popup' == edit_mode && 'uf-group--popup-only'
		].filter( className => !! className ).join( ' ' );

		const titleStyles = {};
		if( title_background ) titleStyles.background = title_background;
		if( title_color )      titleStyles.color      = title_color;

		const boxStyles = {};
		if( border_color ) boxStyles.borderColor = border_color;

		return <div className={ groupClass } data-index={ index } style={ boxStyles }>
			<header className="uf-group__header">
				<div className="uf-group__number">
					{ icon
						? <span className="dashicons { icon }"></span>
						: <strong className="uf-group__number-inside">{ position }</strong>
					}

					<span className="dashicons dashicons-sort"></span>
				</div>

				{ controls }

				<h3 className="uf-group__title" onClick={ onToggle } style={ titleStyles }>
					{ title }
					{ this.getPreviewText() }
				</h3>
			</header>

			{ ! hidden && 'popup' != edit_mode && <div className="uf-group__body">
				<Container { ... this.props } className="uf-fields--boxed" />
			</div> }
		</div>
	}

	getPreviewText() {
		const { source, children, getValueFromContext } = this.props;

		let text = null;

		StoreParser.getAllFields( children ).some( field => {
			const type = getFieldType( field );

			if( 'function' !== typeof type.getPreview ) {
				return;
			}

			text = type.getPreview( field, source, getValueFromContext );
			return true;
		});

		if( text && text.length ) {
			return <span className="uf-group__preview">{ ': ' + text }</span>
		} else {
			return null;
		}
	}
}

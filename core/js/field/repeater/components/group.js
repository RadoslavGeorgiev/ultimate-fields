/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Control from './group-control';
import Fields from 'container/fields';
import { deleteRepeaterRow, toggleRepeaterRow } from 'field/repeater/state/actions';
import { isGroupVisible } from 'field/repeater/state/selectors';
import layoutProps from 'container/layout-props';
import { STYLE_BOXED } from 'constants';
import {
	EDIT_MODE_POPUP,
	EDIT_MODE_INLINE,
	EDIT_MODE_BOTH,
} from 'field/repeater/constants';

/**
 * The component for individual repeater groups.
 */
class RepeaterGroup extends Component {
	static propTypes = {
		number: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		dataPath: PropTypes.array.isRequired,
		container: PropTypes.string.isRequired,
		fields: PropTypes.arrayOf( PropTypes.object ).isRequired,
		icon: PropTypes.string,
		layout: layoutProps.layout,
		visible: PropTypes.bool.isRequired,
		edit_mode: PropTypes.oneOf( [
			EDIT_MODE_INLINE,
			EDIT_MODE_POPUP,
			EDIT_MODE_BOTH,
		] ),
	}

	render() {
		const { icon, number, title, dataPath, container, containerPath, fields, layout, visible } = this.props;

		return (
			<div className={ classNames( 'uf-group', ! visible && 'uf-group--hidden' ) }>
				<div className="uf-group__header">
					<div className="uf-group__number">
						{ icon
							 ? <strong className={ `dashicons ${icon}` } />
							 : <strong className="uf-group-number-inside">{ number }</strong>
						 }

						<span className="dashicons dashicons-sort" />
					</div>

					{ this.renderControls() }

					<h3 className="uf-group__title">
						{ title }
					</h3>
				</div>

				{ visible && <div className="uf-group__inside">
					<Fields
						fields={ fields }
						dataPath={ dataPath }
						containerPath={ containerPath }
						container={ container }
						style={ STYLE_BOXED }
						layout={ layout }
					/>
				</div> }
			</div>
		);
	}

	renderControls() {
		const { onDuplicate, onDelete, onToggle, visible, edit_mode } = this.props;

		return (
			<div className="uf-group__controls">
				<Control icon="admin-page" onClick={ onDuplicate }>Duplicate</Control>
				<Control icon="trash" onClick={ onDelete }>Remove</Control>

				{ ( 'inline' !== edit_mode ) &&
					<Control icon={ 'popup' === edit_mode ? 'edit' : 'editor-expand' } onClick={ () => {} }>
						Open overlay
					</Control>
				}

				{ ( 'popup' !== edit_mode ) && ( visible
					? <Control icon="arrow-up" onClick={ onToggle }>Collapse</Control>
					: <Control icon="arrow-down" onClick={ onToggle }>Expand</Control>
				) }
			</div>
		);
	}
}

export default connect(
	( state, { dataPath } ) => ( {
		visible: isGroupVisible( state, dataPath ),
	} ),
	( dispatch, { dataPath, index, container } ) => ( {
		onDelete: () => dispatch( deleteRepeaterRow( dataPath, index, container ) ),
		onToggle: () => dispatch( toggleRepeaterRow( dataPath ) ),
	} )
)( RepeaterGroup );

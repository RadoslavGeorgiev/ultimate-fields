/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import classNames from 'classnames';
import { get, set } from 'lodash';

/**
 * Internal dependencies
 */
import Control from './group-control';
import Fields from 'container/fields';
import { deleteRepeaterRow, toggleRepeaterRow } from 'field/repeater/state/actions';
import { isGroupVisible } from 'field/repeater/state/selectors';
import { replaceState } from 'state/data/actions';
import layoutProps from 'container/layout-props';
import { STYLE_BOXED } from 'constants';
import {
	EDIT_MODE_POPUP,
	EDIT_MODE_INLINE,
	EDIT_MODE_BOTH,
} from 'field/repeater/constants';
import * as overlay from 'components/overlay';
import Button from 'components/button';
import translate from 'utils/l10n';
import createStore from 'state/store';
import { initializeStore, extractDataFromState, getValidationErrors } from 'container';

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
					<Control icon={ 'popup' === edit_mode ? 'edit' : 'editor-expand' } onClick={ this.expand }>
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

	/**
	 * Expands the group to an overlay while creating a new store for it.
	 */
	expand = () => {
		const {
			title, fields, containerPath, container, dataPath, layout,
			getStore, replaceState, onDelete,
		} = this.props;

		// This store will isolate the popup from the main state
		const store = getStore();

		// The "remove" button will just delete the group and hide the overlay
		const remove = () => {
			onDelete();
			overlay.popLayer();
		};

		// Validation will be performed while saving
		const save = () => {
			const state    = store.getState();
			const dispatch = action => store.dispatch( action );
			const errors   = getValidationErrors( state, dispatch, fields, dataPath, containerPath );

			// Just replace the state and close the popup if ok
			if ( ! errors.length ) {
				replaceState( state );
				overlay.popLayer();
			}

			// Show an alert with the issues
			overlay.alert(
				translate( 'container_issues_title' ),
				[
				<p key="description">
					<strong>{ translate( 'container_issues' ) }</strong>
				</p>,
				<ul key="errors">
					{ errors.map( ( err, i ) => <li key={ i }>{ err }</li> ) }
				</ul>
				]
			);
		};

		// Prevents the standard submission of the form
		const submit = ( e ) => {
			e.preventDefault();
			save();
		}

		// A mini form for the overlay
		const body = <Provider store={ store }>
			<form onSubmit={ submit }>
				<Fields
					fields={ fields }
					dataPath={ dataPath }
					containerPath={ containerPath }
					container={ container }
					style={ STYLE_BOXED }
					layout={ layout }
				/>
			</form>
		</Provider>;

		const buttons = [
			<Button key="Cancel" type="secondary" icon="no-alt" onClick={ remove }>
				{ translate( 'repeater_delete', title ) }
			</Button>,
			<Button key="Save" icon="category" onClick={ save }>
				{ translate( 'repeater_save', title ) }
			</Button>,
		];

		// Finally, show the overlay
		overlay.addLayer( {
			title: translate( 'repeater_edit', title ),
			buttons: buttons,
			body,
		} );
	}
}

export default connect(
	( state, { dataPath } ) => ( {
		visible: isGroupVisible( state, dataPath ),
		getStore: () => createStore( state ),
	} ),
	( dispatch, { dataPath, index, container } ) => ( {
		onDelete: () => dispatch( deleteRepeaterRow( dataPath, index, container ) ),
		onToggle: () => dispatch( toggleRepeaterRow( dataPath ) ),
		replaceState: newState => dispatch( replaceState( newState ) ),
	} )
)( RepeaterGroup );

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Control from './group-control';
import Container from 'container/component';
import { deleteRepeaterRow } from './state/actions';

class RepeaterGroup extends Component {
	render() {
		const { icon, number, title, dataPath, container, fields, layout } = this.props;

		return (
			<div className="uf-group">
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

				<div className="uf-group__inside">
					<Container
						fields={ fields }
						dataPath={ dataPath }
						container={ container }
						style="boxed"
						layout={ layout }
					/>
				</div>
			</div>
		);
	}

	renderControls() {
		const { onDelete, edit_mode } = this.props;

		return (
			<div className="uf-group__controls">
				<Control icon="admin-page">Duplicate</Control>
				<Control icon="trash" onClick={ onDelete }>Remove</Control>

				{ ( 'inline' !== edit_mode ) &&
					<Control icon={ 'popup' === edit_mode ? 'edit' : 'editor-expand' }>
						Open overlay
					</Control>
				}

				{ ( 'popup' !== edit_mode ) && (
					<Control icon="arrow-up">Collapse</Control>,
					<Control icon="arrow-down">Expand</Control>
				) }
			</div>
		);
	}
}

export default connect(
	null,
	( dispatch, { dataPath, index } ) => ( {
		onDelete: () => dispatch( deleteRepeaterRow( dataPath, index ) ),
	} )
)( RepeaterGroup );

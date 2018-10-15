/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { RepeaterGroup, mapStateToProps, mapDispatchToProps } from './group.js';
import Fields from 'container/fields';
import Control from './group-control';
import { STYLE_BOXED } from 'constants';
import Cell from 'field/repeater/components/cell';

export class TableRowGroup extends RepeaterGroup {
	render() {
		const {
			icon,
			number,
			dataPath,
			container,
			containerPath,
			fields,
			layout,
			onDelete,
		} = this.props;

		return (
			<div className="uf-group uf-table__row" data-container={ container }>
				<div className="uf-group__number">
					{ icon
						? <strong className={ 'dashicons ' + icon }></strong>
						: <strong className="uf-group-number-inside">{ number }</strong>
					}
					<span className="dashicons dashicons-sort"></span>
				</div>

				<Fields
					fields={ fields }
					dataPath={ dataPath }
					containerPath={ containerPath }
					container={ container }
					style={ STYLE_BOXED }
					layout={ layout }
					element={ Cell }
				/>

				<Control icon="trash" onClick={ onDelete }>Remove</Control>
			</div>
		);
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( TableRowGroup );

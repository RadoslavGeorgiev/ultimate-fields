/**
 * External dependencies
 */
import React, { Component, Fragment } from 'react';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Group from './group';

export default class RepeaterField extends Component {
	/**
	 * Locates the definition of a group based on its type.
	 *
	 * @param {string} type The type of the group.
	 * @type  {Object}      The Settings of the group.
	 */
	findGroup( type ) {
		const { groups } = this.props;

		return find( groups, { id: type } );
	}

	render() {
		const { value } = this.props;

		return (
			<div className="uf-repeater">
				<div className="uf-repeater__groups">
					{ value.map( this.renderRow ) }
				</div>

				<Button type="primary" icon="plus" onClick={ this.addRow }>Add group</Button>
			</div>
		);
	}

	/**
	 * Renders an individual row/group.
	 *
	 * @param  {Object} data  The data of the group.
	 * @param  {Number} index The index of the group.
	 * @return {Element}
	 */
	renderRow = ( data, index ) => {
		const { name, dataPath, containerPath } = this.props;
		const { __container: container } = data;

		const settings = this.findGroup( data.__type );

		return (
			<Group
				key={ index }
				index={ index }
				number={ index + 1 }
				container={ data.__container }
				dataPath={ [ ...dataPath, name, index ] }
				containerPath={ [ ...containerPath, name, container ] }
				onDuplicate={ this.onDuplicate.bind( this, data, index ) }
				{ ...settings }
			/>
		);
	}

	/**
	 * Handles the add group button click.
	 */
	addRow = () => {
		const { value } = this.props;

		this.props.addRow( value.length );
	}

	/**
	 * Prepares the onDuplicate action for the model.
	 *
	 * @param {Object} data  The data of the individual row.
	 * @param {number} index The index of the row that will be cloned.
	 */
	onDuplicate( data, index ) {
		const { onDuplicate } = this.props;

		onDuplicate( data, index );
	}
}

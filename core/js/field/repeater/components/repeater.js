/**
 * External dependencies
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import {
	CHOOSER_TYPE_WIDGETS,
	CHOOSER_TYPE_DROPDOWN,
	CHOOSER_TYPE_TAGS,
} from 'field/repeater/constants';
import Button from 'components/button';
import Group from './group';
import Prototype from './prototype';


export default class RepeaterField extends Component {
	static propTypes = {
		add_text: PropTypes.string,
		background: PropTypes.string,
		groups: PropTypes.array,
		minimum: PropTypes.number,
		maximum: PropTypes.number,
		placeholder_text: PropTypes.string,
		chooser_type: PropTypes.oneOf( [
			CHOOSER_TYPE_WIDGETS,
			CHOOSER_TYPE_DROPDOWN,
			CHOOSER_TYPE_TAGS,
		] ).isRequired,
	}

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

				{ this.renderChooser() }
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
	 * Renders the "chooser".
	 */
	renderChooser() {
		const { groups, add_text, chooser_type, value } = this.props;

		if ( 1 === groups.length ) {
			return <Button type="primary" icon="plus" onClick={ this.addRow }>
				{ add_text }
			</Button>;
		}

		if ( CHOOSER_TYPE_TAGS === chooser_type ) {

		}

		if ( CHOOSER_TYPE_DROPDOWN === chooser_type ) {

		}

		return (
			<div className="uf-repeater__prototypes">
				{ groups.map( group => {
					return <Prototype
						{ ...group }
						key={ group.id }
						onClick={ () => this.props.addRow( group.id, value.length ) }
					/>
				} ) }
			</div>
		);
	}

	/**
	 * Handles the add group button click.
	 */
	addRow = () => {
		const { value } = this.props;

		this.props.addRow( this.groups[ 0 ].id, value.length );
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

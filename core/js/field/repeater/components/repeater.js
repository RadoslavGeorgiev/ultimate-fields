/**
 * External dependencies
 */
import React, { Component, Fragment, createElement } from 'react';
import PropTypes from 'prop-types';
import { find, map, forEach, filter } from 'lodash';

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
import TableRowGroup from './table-row';
import Prototype from './prototype';
import translate from 'utils/l10n';

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

	state = {
		dropdownOption: this.props.groups[ 0 ].id,
	};

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
		const { value, groups, repeater_layout: layout } = this.props;

		const isTable = ( 1 === groups.length ) && ( 'table' === layout );

		return (
			<div className="uf-repeater">
				{ ! isTable && <div className="uf-repeater__groups" ref="groups">
					{ value.map( this.renderRow ) }
				</div> }

				{ isTable && <div className="uf-table">
					<div className="uf-table__headings">
						{ this.renderTableHeadings() }
					</div>

					<div className="uf-repeater__groups uf-table__groups" ref="groups">
						{ ! value.length &&
							<div className="uf-repeater__placeholder uf-table__placeholder" /> }

						{ value.map( this.renderTableRow ) }
					</div>
				</div> }

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
				key={ container }
				index={ index }
				number={ index + 1 }
				container={ data.__container }
				data={ data }
				dataPath={ [ ...dataPath, name, index ] }
				containerPath={ [ ...containerPath, name, container ] }
				onDuplicate={ this.onDuplicate.bind( this, data, index ) }
				{ ...settings }
			/>
		);
	}

	/**
	 * Renders a row in table mode.
	 *
	 * @param {Object} data  The data of the row.
	 * @param {Number} index The index of the group.
	 * @return {Element}
	 */
	renderTableRow = ( data, index ) => {
		const { name, dataPath, containerPath } = this.props;
		const { __container: container } = data;

		const settings = this.findGroup( data.__type );

		return (
			<TableRowGroup
				key={ container }
				index={ index }
				number={ index + 1 }
				container={ data.__container }
				data={ data }
				dataPath={ [ ...dataPath, name, index ] }
				containerPath={ [ ...containerPath, name, container ] }
				onDuplicate={ this.onDuplicate.bind( this, data, index ) }
				{ ...settings }
			/>
		);
	}

	/**
	 * Makes rows sortable.
	 */
	componentDidMount() {
		const { groups } = this.refs;
		const { onReorder } = this.props;

		jQuery( groups ).sortable( {
			axis:                 'y',
 			handle:               '> .uf-group__header, > .uf-group__number',
 			items:                '> .uf-group',
			revert:               100,
 			forcePlaceholderSize: true,
 			stop: () => {
				const containers = map( groups.children, group => group.dataset.container );
				onReorder( filter( containers ) );
			},
			receive: ( e, ui ) => {
 				this.replacePrototype();
 			},
		} );
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
			return <div className="uf-tags">
				<h4 className="uf-tags__text">{ add_text + ':' }</h4>

				<div className="uf-tags__options">
					{ groups.map( ( { id, title } ) => {
						return createElement( 'button', {
							key: id,
							type: 'button',
							className: 'uf-tag',
							title: translate( 'repeater_click_to_add' ),
							children: title,
							onClick: () => this.addRow( id ),
						} );
					} ) }
				</div>
			</div>;
		}

		if ( CHOOSER_TYPE_DROPDOWN === chooser_type ) {
			const onChange = ( { target: { value } } ) => {
				this.setState( {
					dropdownOption: value
				} );
				this.addRow( value );
			};

			return <div className="uf-repeater__dropdown">
				<select onChange={ onChange }>
					{ groups.map( ( { id, title } ) => {
						return <option key={ id } value={ id }>{ title }</option>;
					} ) }
				</select>

				<Button icon="plus" onClick={ () => this.addRow() }>
					{ add_text || translate( 'repeater_add' ) }
				</Button>
			</div>;
		}

		return (
			<div className="uf-repeater__prototypes">
				{ groups.map( group => {
					return <Prototype
						{ ...group }
						key={ group.id }
						onClick={ () => this.addRow( group.id ) }
					/>
				} ) }
			</div>
		);
	}

	/**
	 * Handles the add group button click.
	 *
	 * @param {string} type The type of the group to add.
	 */
	addRow = ( type = this.state.dropdownOption ) => {
		const { value } = this.props;

		this.props.addRow( type, value.length );
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

	/**
	 * Replaces a prototype from the list of group with a real group.
	 */
	replacePrototype() {
		const { groups } = this.refs;
		const { addRow, value } = this.props;

		// Locate the prototype
		let prototype;
		forEach( groups.children, child => {
			if ( child.classList.contains( 'uf-group--prototype' ) ) {
				prototype = child;
			}
		} );

		// Load data
		const { type } = prototype.dataset;
		const position = Array.from( groups.children ).indexOf( prototype );

		// Clean up
		groups.removeChild( prototype );

		// Add the new row
		addRow( type, position );
	}

	/**
	 * Renders the headings in table mode.
	 *
	 * @return {Element}
	 */
	renderTableHeadings() {
		const { fields } = this.props.groups[ 0 ];

		return filter( map( fields, field => {
			const { name, label, description, field_width, required } = field;

			const width = field_width + '%';
			const html  = { __html: description };

			return <div className="uf-table__heading" key={ name } style={ { width } }>
				<h4>
					{ label }
					{ required && <span className="uf-field__star">*</span> }
				</h4>

				{ description &&
					<div className="uf-field__description" dangerouslySetInnerHTML={ html } /> }
			</div>;
		} ) );
	}
}

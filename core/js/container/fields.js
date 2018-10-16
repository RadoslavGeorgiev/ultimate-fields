/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forEach } from 'lodash';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { TABS_PLACEHOLDER } from 'constants';
import { areDependenciesMet } from 'state/data/selectors';
import { getTab } from 'state/tabs/selectors';
import { getFieldComponents } from 'field';
import layoutProps from 'container/layout-props';
import Tabs from 'components/tabs';

/**
 * This component is responsible for field tables and grids.
 */
export class Fields extends Component {
	static propTypes = {
		// A unique ID for the container (for tabs, etc.)
		container: PropTypes.string,

		// An array of field definitions.
		fields: PropTypes.arrayOf( PropTypes.object ),

		// The path to the data of the container
		dataPath: PropTypes.array,

		// Doesn't show tab buttons inline
		showTabs: PropTypes.bool,

		// Check the layout properties in `layout-props.js`
		...layoutProps,
	}

	static defaultProps = {
		showTabs: true,
	}

	/**
	 * Renders the grid.
	 *
	 * @return {React.Element}
	 */
	render() {
		const { fields, tabs, layout, style, showTabs, className } = this.props;

		// Reset the grid counters
		this.column = 0;
		this.row = 0;

		return (
			<div className={ `uf-fields ${style} ${layout} ${className || ''}` }>
				{ fields.map( field => {
					return ( TABS_PLACEHOLDER === field )
						? ( showTabs && <Tabs key="tabs" { ...this.props } /> )
						: this.renderField( field )
				} ) }
			</div>
		);
	}

	/**
	 * Renders an individual field.
	 *
	 * @param  {Object} definition The definition of the field.
	 * @return {React.Element}
	 */
	renderField( definition ) {
		const { dataPath, containerPath, description_position, layout, style } = this.props;
		const { name, field_width } = definition;

		const field = {
			// Base definition
			...definition,

			// Let the field use the same context as all others.
			dataPath,
			containerPath,

			// Include the styling props.
			layout,
			style,
			description_position,
		};

		// Generate the appropriate grid class
		const gridClasses = this.generateGridClasses( field_width || 100 );
		const partials    = getFieldComponents( field );
		const Element     = this.props.element || partials.Element;
		const Input       = partials.Input;

		return <Element { ...field } key={ name } classNames={ gridClasses }>
			<Input { ...field } />
		</Element>
	}

	/**
	 * Generates grid classes based on the width of the next element.
	 *
	 * @param  {number}   width The width of the next element.
	 * @return {string[]}       An array of classes.
	 */
	generateGridClasses( width ) {
		const { layout } = this.props;

		if ( 'grid' !== layout ) {
			return [];
		}

		const classes = [];

		if( ! this.row ) {
			classes.push( 'top-row' );
		}

		if( ! this.column ) {
			classes.push( 'first-col' );
		}

		this.row   += ( this.column + width ) >= 100 ? 1 : 0;
		this.column = ( this.column + width ) % 100;

		return classes;
	}
}

/**
 * Separates tabs and fields while checking for visiblity.
 *
 * @param  {Object} state    The global Redux state.
 * @param  {Object} ownProps The props of the component.
 * @return {Object}          Additional props.
 */
const mapStateToProps = ( state, ownProps ) => {
	const { dataPath, containerPath, container, fields: allFields, showTabs } = ownProps;

	const fields = [];
	const tab    = getTab( state, container );

	let tabsAdded;

	forEach( allFields, definition => {
		const { name, dependencies } = definition;

		// Handle tabs separately.
		if ( 'tab' === definition.type ) {
			if ( ! tabsAdded ) {
				tabsAdded = true;
				fields.push( TABS_PLACEHOLDER );
			}

			return;
		}

		// Check the visiblity of the field.
		if (
			( definition.tab && tab !== definition.tab ) // Tabs
			|| ! areDependenciesMet( state, dataPath, dependencies ) // Conditional logic
		) {
			return;
		}

		// The field is visible, add to the list
		fields.push( definition );
	} );

	return {
		fields,
		rawFields: allFields,
	};
};

export default connect( mapStateToProps )( Fields );

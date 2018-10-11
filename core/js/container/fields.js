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
import Tab from 'components/tab';

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

		// Check the layout properties in `layout-props.js`
		...layoutProps,
	}

	/**
	 * Renders the grid.
	 *
	 * @return {React.Element}
	 */
	render() {
		const { fields, layout, style } = this.props;

		// Reset the grid counters
		this.column = 0;
		this.row = 0;

		return (
			<div className={ `uf-fields ${style} ${layout}` }>
				{ fields.map( field => {
					return ( TABS_PLACEHOLDER === field )
						? this.renderTabs()
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

		const { Element, Input } = getFieldComponents( field );
		return <Element { ...field } key={ name } classNames={ gridClasses }>
			<Input { ...field } />
		</Element>
	}

	/**
	 * Renders all of the container's tabs.
	 *
	 * @param {Object} definition The definition of the field.
	 */
	renderTabs() {
		const { container, tabs: all, style, layout, dataPath } = this.props;

		const tabs = all.map( tab => {
			return <Tab
				key={ tab.name }
				container={ container }
				dataPath={ dataPath }
				style={ style }
				{ ...tab }
			/>;
		} );

		return (
			<div className={ `uf-tabs uf-tabs--${style} uf-tabs--${layout}` } key="tabs">
				{ tabs }
			</div>
		);
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
	const { dataPath, container, fields: allFields } = ownProps;

	const tabs   = [];
	const fields = [];
	const tab    = getTab( state, container );

	forEach( allFields, definition => {
		const { dependencies } = definition;

		// Handle tabs separately.
		if ( 'tab' === definition.type ) {
			// Replace the first tab with a palceholder
			if ( 0 === tabs.length ) {
				fields.push( TABS_PLACEHOLDER );
			}

			// Add to the list of tabs
			return tabs.push( definition );
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
		tabs,
		fields,
	};
};

export default connect( mapStateToProps )( Fields );

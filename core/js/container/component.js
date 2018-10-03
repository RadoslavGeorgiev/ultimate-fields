import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forEach, isEqual } from 'lodash';

import { areDependenciesMet } from 'state/data/selectors';
import { getTab } from 'state/tabs/selectors';
import { getFieldComponents } from 'field';
import Tab from 'components/tab';

export class Container extends Component {
	render() {
		// Reset the grid counters
		this.column = 0;
		this.row = 0;

		return this.renderFields();
	}

	renderFields() {
		const { fields, tabs, layout, style } = this.props;

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

	renderField = definition => {
		const { dataPath, description_position, layout, style, areDependenciesMet } = this.props;
		const { name, field_width, tab } = definition;

		const field = {
			...definition,
			dataPath,
			layout,
			style,
			description_position,
		};

		const gridClasses = this.generateGridClasses( field_width || 100 );

		const { Element, Input } = getFieldComponents( field );
		return <Element { ...field } key={ name } classNames={ gridClasses }>
			<Input { ...field } />
		</Element>
	}

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

	renderTabs() {
		const { tabs, style, dataPath } = this.props;

		return (
			<div className={ `uf-tabs uf-tabs--${style}` } key="tabs">
				{ tabs.map( tab => {
					return <Tab
						key={ tab.name }
						dataPath={ dataPath }
						style={ style }
						{ ...tab }
					/>;
				} ) }
			</div>
		);
	}
}

const TABS_PLACEHOLDER = {
	type: 'tabs'
};

const mapStateToProps = ( state, ownProps ) => {
	const { dataPath } = ownProps;

	const tabs   = [];
	const fields = [];
	const tab    = getTab( state, dataPath );

	forEach( ownProps.fields, definition => {
		const deps = areDependenciesMet( state, dataPath, definition.dependencies );

		if ( 'tab' === definition.type ) {
			if ( 0 === tabs.length ) {
				fields.push( TABS_PLACEHOLDER );
			}

			return tabs.push( definition );
		}

		if ( definition.tab && tab !== definition.tab ) {
			return;
		}

		if ( ! deps ) {
			return;
		}

		fields.push( definition );
	} );

	return {
		tabs,
		fields,
	};
};

export default connect( mapStateToProps )( Container );

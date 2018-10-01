import React, { Component } from 'react';

import { getFieldElement, getFieldInput } from './../field/';

export default class Fields extends Component {
	render() {
		// Reset the grid counters
		this.column = 0;
		this.row = 0;

		return this.renderFields();
	}

	renderFields() {
		const { fields, layout, style } = this.props;

		return (
			<div className={ `uf-fields ${style} ${layout}` }>
				{ fields.map( this.renderField ) }
			</div>
		);
	}

	renderField = definition => {
		const { datastore, description_position, layout, style } = this.props;
		const { name, field_width } = definition;

		const field = {
			...definition,
			datastore,
			layout,
			style,
			description_position,
		};

		const Element = getFieldElement( field );
		const Input = getFieldInput( field );

		const gridClasses = this.generateGridClasses( field_width || 100 );

		return <Element { ...field } key={ field.name } classNames={ gridClasses }>
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
}

/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Element from 'field/element';
import Model from 'field/model';

/**
 * Handles fields as table cells.
 */
export class Cell extends Element {
	render() {
		const { children, field_width, classNames } = this.props;

		// A shortcut to the elementClass method
		const el = this.elementClass.bind( this );

		// Prepare the root classes
		const className = el( null )
			+ ' uf-table__cell';
			+ classNames.map( name => ' ' + name ).join( '' );

		// Prepare styles
		const styles = {};
		styles.width = field_width + '%';

		// Use a generic skeleton
		return <div className={ className } style={ styles }>
			<div className={ el( 'input' ) }>
				{ children }
				{ this.renderValidationMessage() }
			</div>
		</div>
	}
}

// Connect for validation
const basicModel = new Model;
export default connect( basicModel.mapStateToProps.bind( basicModel ) )( Cell );

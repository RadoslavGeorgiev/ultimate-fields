/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import WPObjectFieldModel from 'field/wp-object/model';

export default class WPObjectsFieldModel extends WPObjectFieldModel {
	/**
	 * Maps the global state to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapStateToProps() {
		return ( state, props ) => {
			let value     = this.getValueFromState( props, state );
			const objects = value.map( id => getObject( state, id ) );

            return {
                ...this.getGenericStateProps( state, props ),
				value,
				objects,
				chooserProps: this.getChooserProps( props, value ),
            };
		};
	}
}
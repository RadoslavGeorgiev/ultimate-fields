/**
 * External dependencies.
 */
import {  } from 'lodash';

/**
 * Internal dependencies.
 */
import Model from 'field/model';
import { getValue } from 'state/data/selectors';
import { cacheObject } from './state/actions.js';
import { getObject } from './state/selectors.js';

/**
 * Handles the data and infrastructure for the file field.
 */
export default class WPObjectFieldModel extends Model {
	/**
	 * Extracts the value of a field from the state.
	 *
	 * @param  {Object} props A field definition.
	 * @param  {Object} state The global Redux state.
	 * @return {*}            The value of the field.
	 */
	getValueFromState( props, state ) {
		const { name, multiple, dataPath } = props;

		const value = getValue( state, [ ...dataPath, name ] );

		return multiple
			? ( value || [] )
			: ( value || false );
	}

	/**
	 * Generates all actions, which are required to initialize the field.
	 *
	 * @param {Object} props   The definition of a field.
	 * @param {Object} context The initial data that is available.
	 * @type  {Array}          A list of actions that should be performed.
	 */
	getInitialActions( props, context ) {
        const { name } = props;

        const actions = [
            super.getInitialActions( props, context ),
        ];

        if ( context.hasOwnProperty( `${name}_prepared` ) ) {
			const prepared = context[ `${name}_prepared` ];
			
            prepared.forEach( item => {
                actions.push( cacheObject( item ) );
            } );
		}
        
		return actions;
    }
    
    /**
	 * Maps the global state to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapStateToProps() {
		return ( state, props ) => {
			let value    = this.getValueFromState( props, state );
			const object = getObject( state, value );

			if ( ! object ) {
				value = false;
			}

            return {
                ...this.getGenericStateProps( state, props ),
				value,
				object,
				chooserProps: this.getChooserProps( props, value ),
            };
		};
	}
	
	/**
	 * Returns the generic arguments for the chooser.
	 * 
	 * @param {Object} props The definition of a field.
	 * @param {mixed}  value The value that should be given to the chooser.
	 * @return {Object}
	 */
	getChooserProps( props, value ) {
		const { name, nonce, multiple } = props;

		return {
			name,
			nonce,
			multiple,
			selected: multiple ? value : ( value ? [ value ] : [] ),
		}
	}
}

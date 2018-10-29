/**
 * Internal dependencies.
 */
import Model from 'field/model';
import { getValidationMessage } from 'state/validation/selectors';
import { cacheFile } from './state/actions';
import { getValue, areDependenciesMet } from 'state/data/selectors';
import {
    getFile,
    isFileLoaded,
    isFileLoading,
} from './state/selectors';

/**
 * Handles the data and infrastructure for the file field.
 */
export default class FileFieldModel extends Model {
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
                actions.push( cacheFile( item ) );
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
            const value = this.getValueFromState( props, state );

            return {
                value,
                invalid:   getValidationMessage( state, props ),
                file:      ( value ? getFile( state, value ) : false ),
                isLoaded:  ( value ? isFileLoaded( state, value ) : false ),
                isLoading: ( value ? isFileLoading( state, value ) : false ),
            };
		};
    }

    /**
	 * Maps a dispatcher to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapDispatchToProps() {
		return ( dispatch, props ) => ( {
            onChange: value => dispatch( this.updateValue( props, value ) ),
            cacheFile: file => dispatch( cacheFile( file ) ),
		} )
	}
}

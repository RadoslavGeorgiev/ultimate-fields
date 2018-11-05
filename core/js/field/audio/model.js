/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies.
 */
import FileFieldModel from 'field/file/model';
import { getValidationMessage } from 'state/validation/selectors';
import {
    getFile,
    isFileLoaded,
    isFileLoading,
} from 'field/file/state/selectors';

/**
 * Handles the UI of the audio field.
 */
export default class AudioFieldModel extends FileFieldModel {
	/**
	 * Maps the global state to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapStateToProps() { return ( state, props ) => {
        const additionalProps = {
            invalid: getValidationMessage( state, props ),
        };

        // Prepare the basic balue
        const value = this.getValueFromState( props, state );

        // No value, no extra checks
        if ( ! value || isEmpty( value ) ) {
            return {
                ...additionalProps,
                value: false,
                isLoaded: false,
                isLoading: false,
            }
        };

        const files = [];
        let isLoaded  = true;
        let isLoading = false;

        // Check all individual files
        value.forEach( id => {
            if ( isFileLoaded( state, id ) ) {
                files.push( getFile( state, id ) );
            } else {
                isLoaded = false;
            }

            if ( isFileLoading( state, id ) ) {
                isLoading = true;
            }
        } );
        
        return {
            ...additionalProps,
            value,
            files,
            isLoaded,
            isLoading,
        };
    } }
}

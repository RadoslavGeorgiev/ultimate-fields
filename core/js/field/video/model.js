/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies.
 */
import FileFieldModel from 'field/file/model';
import {
    getFile,
    isFileLoaded,
    isFileLoading,
} from 'field/file/state/selectors';

/**
 * Handles the UI of the video field.
 */
export default class VideoFieldModel extends FileFieldModel {
	/**
	 * Maps the global state to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapStateToProps() { return ( state, props ) => {
        // Prepare the basic balue
        const value = this.getValueFromState( props, state );

        // No value, no extra checks
        if ( ! value || isEmpty( value.videos ) ) {
            return {
                ...this.getGenericStateProps( state, props ),
                value,
                isLoaded: false,
                isLoading: false,
            }
        }

        const files = [];
        const filesToFetch = [];
        let isLoaded  = true;
        let isLoading = false;

        const handleFile = id => {
            if ( isFileLoaded( state, id ) ) {
                return files.push( getFile( state, id ) );
            }

            isLoaded = false;

            if ( isFileLoading( state, id ) ) {
                isLoading = true;
            } else {
                filesToFetch.push( id );
            }
        };

        // Check all individual files
        value.videos.forEach( handleFile );
        if ( value.poster ) {
            handleFile( value.poster );
        }
        
        return {
            ...this.getGenericStateProps( state, props ),
            value,
            files,
            isLoaded,
            isLoading,
            filesToFetch,
        };
    } }
}


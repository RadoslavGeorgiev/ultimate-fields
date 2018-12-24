/**
 * External dependencies.
 */
import { isArray } from 'lodash';

/**
 * Internal dependencies.
 */
import Model from 'field/model';
import { cacheFile } from './state/actions';
import {
    getFile,
    isFileLoaded,
    isFileLoading,
} from './state/selectors';
import {
    fetchFiles
} from 'field/file/state/actions';

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
                ...this.getGenericStateProps( state, props ),
                value,
                file:      ( value ? getFile( state, value ) : false ),
                isLoaded:  ( value ? isFileLoaded( state, value ) : false ),
                isLoading: ( value ? isFileLoading( state, value ) : false ),
            };
		};
    }

    /**
	 * Maps a dispatcher to the props of a wrapped component.
	 *
	 * @return {Object} An additional hash with objects to map.
	 */
	mapDispatchToExtraProps( props, dispatch ) {
		return {
            cacheFile: file => dispatch( cacheFile( file ) ),

            fetchFiles: ids => {
                // Dispatch the action in order to mark the files as loading
                dispatch( fetchFiles( ids ) );

                // Load the files
                this.fetchFiles( props, dispatch, ids );
            },
		};
    }
    
    /**
     * Fetches files from the servers.
     * 
     * @param {Object}   props    The definition of a field.
     * @param {Function} dispatch The dispatcher to use.
     * @param {Array}    ids      All file IDS that should be loaded.
     */
    fetchFiles( props, dispatch, ids ) {
        const { name, nonce, nonce_action } = props;
    
        const data = {
            uf_action: `file_preview_${name}`,
            file_ids: isArray( ids ) ? ids : [ ids ],
            nonce,
            nonce_action,
        };
    
        jQuery.ajax( {
            data,
            url: window.location.href,
            type: 'post',
            success: this.receiveFiles.bind( this, dispatch ),
        } );
    }
    
    /**
     * Processes the JSON once files have been received from PHP.
     * 
     * @param {Function} dispatch The store dispatcher.
     * @param {string}   json     The JSON that has been received.
     */
    receiveFiles( dispatch, json ) {
        if ( ! json ) {
            return;
        }
    
        // AJAX failed, bail
        const data = JSON.parse( json );
        if ( ! data ) {
            return;
        }
    
        // Cache the files
        data.map( file => {
            dispatch( cacheFile( file ) );
        } );
    }
}

/**
 * External dependencies
 */
import { forEach } from 'lodash';

/**
 * Internal dependencies
 */
import { LOADING } from 'constants';
import {
    CACHE_FILE,
    FETCH_FILES,
    FILES_FETCHED,
} from './action-types';
import { createReducer } from 'state/redux-helpers';

export default {
	files: createReducer( {}, {
        [ CACHE_FILE ]: ( state, { file } ) => ( {
            ...state,
            [ file.id ]: file,
        } ),

        [ FETCH_FILES ]: ( state, { ids } ) => {
            const newState = Object.assign( {}, state );

            forEach( ids, id => {
                newState[ id ] = LOADING;
            } );

            return newState;
        },
    } ),
};

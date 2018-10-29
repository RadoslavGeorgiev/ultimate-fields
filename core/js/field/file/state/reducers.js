/**
 * External dependencies
 */
import {  } from 'lodash';

/**
 * Internal dependencies
 */
import { LOADING } from 'constants';
import {
    CACHE_FILE,
    LOAD_FILE,
    FILE_LOADED,
} from './action-types';
import { createReducer } from 'state/redux-helpers';

export default {
	files: createReducer( {}, {
        [ CACHE_FILE ]: ( state, { file } ) => ( {
            ...state,
            [ file.id ]: file,
        } ),

        [ LOAD_FILE ]: ( state, { id } ) => ( {
            ...state,
            [ file.id ]: LOADING,
        } ),

        [ FILE_LOADED ]: ( state, { file } ) => ( {
            ...state,
            [ file.id ]: file,
        } ),
    } ),
};

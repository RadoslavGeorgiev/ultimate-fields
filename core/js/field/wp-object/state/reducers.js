/**
 * External dependencies
 */
import { forEach } from 'lodash';

/**
 * Internal dependencies
 */
import { LOADING } from 'constants';
import {
    CACHE_OBJECT,
    FETCH_OBJECTS,
} from './action-types';
import { createReducer } from 'state/redux-helpers';

export default {
	objects: createReducer( {}, {
        [ CACHE_OBJECT ]: ( state, { object } ) => ( {
            ...state,
            [ object.id ]: object,
        } ),

        [ FETCH_OBJECTS ]: ( state, { ids } ) => {
            const newState = Object.assign( {}, state );

            forEach( ids, id => {
                newState[ id ] = LOADING;
            } );

            return newState;
        },
	} ),
};

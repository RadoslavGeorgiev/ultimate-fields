/**
 * Internal dependencies
 */
import { LOADING } from 'constants';

export const getObject = ( state, id ) => {
    return state.objects[ id ] || null;
}

export const isObjectLoaded = ( state, id ) => {
    const object = getObject( state, id );

    if ( ! object ) {
        return false;
    }

    return LOADING !== object;
}

export const isObjectLoading = ( state, id ) => {
    const object = getObject( state, id );

    if ( ! object ) {
        return false;
    }

    return LOADING === object;
}
/**
 * Internal dependencies
 */
import { LOADING } from 'constants';

export const getFile = ( state, id ) => {
    return state.files[ id ] || null;
}

export const isFileLoaded = ( state, id ) => {
    const file = getFile( state, id );

    if ( ! file ) {
        return false;
    }

    return LOADING !== file;
}

export const isFileLoading = ( state, id ) => {
    const file = getFile( state, id );

    if ( ! file ) {
        return false;
    }

    return LOADING === file;
}
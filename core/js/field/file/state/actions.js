import {
    CACHE_FILE,
    FETCH_FILES,
} from './action-types';

export const cacheFile = file => ( {
    type: CACHE_FILE,
    file,
} );

export const fetchFiles = ( ids, dispatch ) => {
    return {
        type: FETCH_FILES,
        ids,
    };
};
import {
    CACHE_FILE,
    LOAD_FILE,
} from './action-types';

export const cacheFile = file => ( {
    type: CACHE_FILE,
    file,
} );

export const loadFile = id => ( {
    type: LOAD_FILE,
    id,
} );
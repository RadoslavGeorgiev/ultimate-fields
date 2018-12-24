import {
	isArray
} from 'lodash';

import {
    CACHE_OBJECT,
    FETCH_OBJECTS,
} from './action-types';

export const cacheObject = object => ( {
    type: CACHE_OBJECT,
    object,
} );

export const fetchFiles = ( ids ) => {
    return {
        type: FETCH_OBJECTS,
        ids: isArray( ids ) ? ids : [ ids ],
    };
};
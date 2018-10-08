import { isArray, forEach, mergeWith, uniqueId } from 'lodash';

export const generateContainerId = ( base = 'container-' ) => {
	return uniqueId( base );
}

export const mergeCallback = ( target, source ) => {
	if ( isArray( target ) ) {
		const result = [ ...target ];

		forEach( source, entry => {
			if ( entry ) {
				result.push( entry );
			}
		} );

		return result;
	}
};

export const mergeWithArrays = ( target, source ) => {
	return mergeWith( target, source, mergeCallback );
}

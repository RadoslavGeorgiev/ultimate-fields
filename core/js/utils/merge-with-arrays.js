import { isArray, forEach, mergeWith } from 'lodash';

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

export default ( target, source ) => {
	return mergeWith( target, source, mergeCallback );
}
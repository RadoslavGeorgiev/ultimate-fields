import { isArray, forEach, mergeWith, uniqueId } from 'lodash';

/**
 * Generates a unique container ID.
 *
 * @param  {string} base The base ID to use.
 * @return {string}
 */
export const generateContainerId = ( base = 'container-' ) => {
	return uniqueId( base );
}

/**
 * Handles the merging of arrays within mergeWithArrays.
 *
 * @param  {Object} target The object that values should be merged into.
 * @param  {Object} source The object that contains the values to merge.
 * @return {Array}         The custom array in case the behavior of `merge` should be changed.
 */
export const mergeCallback = ( target, source ) => {
	if ( ! isArray( target ) ) {
		return;
	}

	const result = [ ...target ];

	forEach( source, entry => {
		if ( entry ) {
			result.push( entry );
		}
	} );

	return result;
};

/**
 * Merges objects while adding the values of arrays.
 *
 * @param  {Object} target The object with source data.
 * @param  {Object} source The object with values to add to the target.
 * @return {Object}        The product.
 */
export const mergeWithArrays = ( target, source ) => {
	return mergeWith( {}, target, source, mergeCallback );
}

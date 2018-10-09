import { get } from 'lodash';

/**
 * Retrieves the value found at a certain path.
 *
 * @param  {Object} state The global state.
 * @param  {Array}  path  The path to the value.
 * @return {*}            The value that was found.
 */
export const getValue = ( state, path ) => {
	return get( state.data, path );
}

/**
 * Checks whether a set of dependencies is satisfied.
 *
 * @param  {Object} state        The global state.
 * @param  {Array}  context      The selector of the context.
 * @param  {Array}  dependencies All fo the dependencies to check.
 * @return {boolean}
 */
export const areDependenciesMet = ( state, context, dependencies ) => {
	if ( ! dependencies || 0 === dependencies.length ) {
		return true;
	}

	const target = getValue( state, [ ...context, dependencies[0][0].field ] );

	return !! target;
}

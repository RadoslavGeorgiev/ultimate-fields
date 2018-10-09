import { get } from 'lodash';

export const getValue = ( state, path ) => {
	return get( state.data, path );
}

export const areDependenciesMet = ( state, context, dependencies ) => {
	if ( ! dependencies || 0 === dependencies.length ) {
		return true;
	}

	const target = getValue( state, [ ...context, dependencies[0][0].field ] );

	return !! target;
}

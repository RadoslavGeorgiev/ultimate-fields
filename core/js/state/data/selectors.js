import { get } from 'lodash';

import { TAB_KEY } from 'constants';

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

export const getTab = ( state, path ) => {
	return getValue( state, [ ...path, TAB_KEY ] );
}

export const isTabActive = ( state, path, tab ) => {
	return getTab( state, path ) === tab;
}

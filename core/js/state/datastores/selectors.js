import { get } from 'lodash';

export const getValue = ( state, path ) => {
	return get( state.datastores, path );
}

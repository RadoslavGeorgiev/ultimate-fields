import { set, merge } from 'lodash';

import createReducer from 'state/create-reducer';
import {
	UPDATE_VALUE,
} from 'state/action-types';
import { mergeWithArrays } from 'utils';

export default createReducer( {}, {
	[ UPDATE_VALUE ]: ( state, { path, value } ) => {
		const diff = set( {}, path, value );
		return merge( {}, state, diff );
	},
} );

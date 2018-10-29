import { reduce, unset } from 'lodash';

import { createReducer } from 'state/redux-helpers';
import {
	CHANGE_TAB,
} from 'state/action-types';

export default createReducer( {}, {
	[ CHANGE_TAB ]: ( state, { container, tab } ) => ( {
		...state,
		[ container ]: tab,
	} ),
} );

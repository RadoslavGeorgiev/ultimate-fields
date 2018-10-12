import { reduce, unset } from 'lodash';

import createReducer from 'state/create-reducer';
import {
	CHANGE_TAB,
} from 'state/action-types';

export default createReducer( {}, {
	[ CHANGE_TAB ]: ( state, { container, tab } ) => ( {
		...state,
		[ container ]: tab,
	} ),
} );

import { combineReducers } from 'redux';

import datastores from './datastores/reducer';

export default combineReducers( {
	datastores,
} );

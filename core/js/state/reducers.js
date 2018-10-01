import { combineReducers } from 'redux';

import datastores from './datastores/reducer';
import tabs from './tabs/reducer';

export default combineReducers( {
	datastores,
	tabs,
} );

/**
 * External dependencies
 */
import { enableBatching } from 'redux-batched-actions';

/**
 * Internal dependencies
 */
import { combineReducers } from 'state/redux-helpers';
import { createCombinedReducer } from 'field';
import { REPLACE_STATE } from 'state/action-types';
import data from 'state/data/reducer';
import tabs from 'state/tabs/reducer';
import validation from 'state/validation/reducer';
import env from 'state/env/reducer';

/**
 * Generates the top-level reducer.
 *
 * @return {Function} The reducer.
 */
export default () => {
	const reducers = {
		env,
		data,
		tabs,
		validation,
	};

	// Matryoshka
	const basicReducer = combineReducers( reducers );
	const combinedReducer = createCombinedReducer( basicReducer );
	const batchedReducer = enableBatching( combinedReducer );

	// Add a an action handler for state replacement
	return ( state, action ) => {
		return ( REPLACE_STATE === action.type )
			? action.newState
			: batchedReducer( state, action )
	}
}

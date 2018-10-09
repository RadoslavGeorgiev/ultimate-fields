/**
 * External dependencies
 */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

/**
 * Internal dependencies
 */
import createReducer from 'state/reducer';
import batchMiddleware from 'state/batch';

/**
 * Generates a store.
 *
 * @return {Object} A Redux store.
 */
export default () => {
	const reducer = createReducer();

	return createStore(
		reducer,
		composeWithDevTools( applyMiddleware( batchMiddleware( reducer ) ) )
	)
};

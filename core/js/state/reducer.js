/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { createCombinedReducer } from 'field';
import data from 'state/data/reducer';
import tabs from 'state/tabs/reducer';

/**
 * Generates the top-level reducer.
 *
 * @return {Function} The reducer.
 */
export default () => createCombinedReducer(
	combineReducers(
		{
			data,
			tabs,
		}
	)
);

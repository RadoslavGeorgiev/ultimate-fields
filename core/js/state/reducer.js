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
import validation from 'state/validation/reducer';
import env from 'state/env/reducer';

/**
 * Generates the top-level reducer.
 *
 * @return {Function} The reducer.
 */
export default () => createCombinedReducer(
	combineReducers(
		{
			env,
			data,
			tabs,
			validation,
		}
	)
);

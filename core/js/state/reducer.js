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

export const reducers = {
	data,
	tabs,
};

export default () => createCombinedReducer(
	combineReducers(
		reducers
	)
);

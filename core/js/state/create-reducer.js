import { isArray } from 'lodash';
import { mergeWithArrays } from 'utils';

/**
 * Creates a new reducer based on an initial state and an array of actions.
 *
 * @param  {string} name         The name of the reducer.
 * @param  {Object} initialState The state to begin with.
 * @param  {Object} actions      A hash of action types and action handlers.
 * @return {function}            The generated reducer.
 */
export default ( name, initialState, actions ) => {
	/**
	 * A custom-made reducer.
	 *
	 * @param  {Object} state  The current sub-state.
	 * @param  {Object} action The action that is to be performed.
	 * @return {Object}        An eventually modified state.
	 */
	return ( state, action ) => {
		const { type, batchAction } = action;

		if ( actions.hasOwnProperty( type ) ) {
			return actions[ type ]( state, action );
		}

		if ( ( true === batchAction ) && action.diff.hasOwnProperty( name ) && ! isArray( state ) ) {
			return mergeWithArrays( state, action.diff[ name ] );
		}

		if ( 'undefined' === typeof state ) {
			return initialState;
		}

		return state;
	}
}

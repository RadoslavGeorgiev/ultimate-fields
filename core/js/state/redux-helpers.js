import { forEach } from 'lodash';

/**
 * Works similarly to Redux's implementation, but is looser and allows new
 * top-level trees to be created without having a reducer for them.
 * 
 * @param  {Object.Function} reducers A hash with all reducers.
 * @return {Function}
 */
export const combineReducers = ( reducers ) => {
    return ( state, action ) => {
        const newState = Object.assign( {}, state );

        forEach( reducers, ( reducer, treeName ) => {
            newState[ treeName ] = reducer( newState[ treeName ], action );
        } );

        return newState;
    }
}

/**
 * Creates a new reducer based on an initial state and an array of actions.
 *
 * @param  {Object} initialState The state to begin with.
 * @param  {Object} actions      A hash of action types and action handlers.
 * @return {function}            The generated reducer.
 */
export const createReducer = ( initialState, actions ) => {
	/**
	 * A custom-made reducer.
	 *
	 * @param  {Object} state  The current sub-state.
	 * @param  {Object} action The action that is to be performed.
	 * @return {Object}        An eventually modified state.
	 */
	return ( state, action ) => {
		const { type } = action;

		if ( actions.hasOwnProperty( type ) ) {
			return actions[ type ]( state, action );
		}

		if ( 'undefined' === typeof state ) {
			return initialState;
		}

		return state;
	}
}

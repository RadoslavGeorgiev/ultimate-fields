import { CREATE_BATCH } from 'state/action-types';

/**
 * Generates a new middleware based on reducers.
 *
 * This middleware will catch all `CREATE_BATCH` actions,
 * execute the sub-actions and generate a new action with all changes.
 *
 * @param  {function} reducers The reducer that handles individual actions.
 * @return {Object}
 */
export default ( reducers ) => ( store ) => ( next ) => ( action ) => {
	if ( CREATE_BATCH !== action.type ) {
		return next( action );
	}

	const { maskAs, actions } = action;
	const state = store.getState();
	let diff = reducers( {}, { type: '@@INIT' });

	actions.forEach( subAction => {
		diff = reducers( diff, subAction );
	} );

	return next( {
		type: maskAs,
		batchAction: true,
		diff,
		actions,
	} );
}

const CREATE_BATCH = 'CREATE_BATCH';

export const createBatch = ( actions, maskAs ) => ( {
	type: CREATE_BATCH,
	actions,
	maskAs,
} );

export default reducers => store => next => action => {
	if ( CREATE_BATCH !== action.type ) {
		return next( action );
	}

	const { maskAs, actions } = action;
	const state = store.getState();
	let diff = {};

	actions.forEach( subAction => {
		diff = reducers( diff, subAction );
	} );

	return next( {
		type: maskAs,
		diff,
	} );
}

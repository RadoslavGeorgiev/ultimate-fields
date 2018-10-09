import { CREATE_BATCH } from 'state/action-types';

export default reducers => store => next => action => {
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

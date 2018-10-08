import { CREATE_BATCH } from 'state/action-types';

export const createBatch = ( maskAs, actions ) => ( {
	type: CREATE_BATCH,
	actions,
	maskAs,
} );
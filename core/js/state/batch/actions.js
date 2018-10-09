import { CREATE_BATCH } from 'state/action-types';

/**
 * Generates a new batch.
 *
 * @param  {string} maskAs  The action to mask the batch as.
 * @param  {Array}  actions All actions that have to be executed within the batch.
 * @return {Object}         The action.
 */
export const createBatch = ( maskAs, actions ) => ( {
	type: CREATE_BATCH,
	actions,
	maskAs,
} );

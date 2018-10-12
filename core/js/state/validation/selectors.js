/**
 * External dependencies
 */
import { get } from 'lodash';

export const getValidationMessage = ( state, { containerPath, name } ) => {
	const path  = [ ...containerPath, name ];
	return get( state.validation, path.join( '/' ), false );
}

/**
 * External dependencies
 */
import { find, isEqual } from 'lodash';

export const getValidationMessage = ( state, props ) => {
	const path  = [ ...props.containerPath, props.name ];
	const entry = find( state.validation, row => isEqual( row.path, path ) );
	return entry ? entry.message : false;
}

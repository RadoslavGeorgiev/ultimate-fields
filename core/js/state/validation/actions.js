/**
 * Internal dependencies
 */
import {
	SET_VALIDATION_MESSAGE,
	CLEAR_VALIDATION_MESSAGE,
} from 'state/action-types';

/**
 * Saves the validation message of a field.
 *
 * @param {Object} props   The definition of a field.
 * @param {string} message The message to use.
 * @return {Object}
 */
export const setValidationMessage = ( props, message ) => ( {
	type: SET_VALIDATION_MESSAGE,
	path: [ ...props.containerPath, props.name ],
	message,
} );

/**
 * Saves the validation message of a field.
 *
 * @param {Object} props   The definition of a field.
 * @param {string} message The message to use.
 * @return {Object}
 */
export const clearValidationMessage = ( props ) => ( {
	type: CLEAR_VALIDATION_MESSAGE,
	path: [ ...props.containerPath, props.name ],
} );

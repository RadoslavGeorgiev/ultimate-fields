/**
 * External dependencies
 */
import { isEmpty, forEach } from 'lodash';

/**
 * Checks whether a value is in an array.
 *
 * @param  {Array} array The array to browse.
 * @param  {*}     value The value to check.
 * @return {Boolean}
 */
function inArray( array, value ) {
	return -1 !== array.indexOf( value );
}

/**
 * Checks a rule that works with singular values.
 *
 * @param  {Object} rules The pair of `visible` and `hidden` rules to check.
 * @param  {*}      value The value to check within the arrays.
 * @return {Boolean}
 */
export const checkSingleRule = ( rules, value ) => {
	if ( ! rules ) {
		return true;
	}

	const { visible, hidden } = rules;

	if ( inArray( hidden, value ) ) {
		return false;
	}

	if ( ! isEmpty( visible ) && ! inArray( visible, value ) ) {
		return false;
	}

	return true;
}


/**
 * Checks a rule that works with multiple values.
 *
 * @param  {Object}  rules  The pair of `visible` and `hidden` rules to check.
 * @param  {Array.*} values The values to check within the arrays.
 * @return {Boolean}
 */
export const checkMultipleRules = ( rules, value ) => {
	if ( ! rules ) {
		return true;
	}

	const { visible, hidden } = rules;

	let isHidden = false;
	forEach( hidden, rule => {
		if ( inArray( value, rule ) ) {
			isHidden = true;
		}
	} );
	if ( isHidden ) {
		return false;
	}

	let isVisible = false;
	forEach( visible, rule => {
		if ( inArray( value, rule ) ) {
			isVisible = true;
		}
	} );
	if ( ! isVisible ) {
		return false;
	}
	
	return true;
}

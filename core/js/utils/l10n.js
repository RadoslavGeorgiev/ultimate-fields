/**
 * Internal dependencies
 */
import { sprintf } from 'utils';

// Load the global l10n object
const strings = window.uf_l10n || {};

/**
 * Localizes a string by ID and replaces all placeholders.
 *
 * @param  {string} id   The name of the string.
 * @param  {*}      args All following arguments will be used as placeholder.
 * @return {string}      The localized string.
 */
export default function translate( id, ...args ) {
	const string = strings[ id ];

	if ( ! string ) {
		return `{Unknown string ${id}}`;
	}

	return sprintf( string, ...args );
}

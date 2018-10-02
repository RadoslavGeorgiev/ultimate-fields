/**
 * Returns a very generic "field input" that indicates an un-supported field type.
 *
 * @return {string}
 */
export default ( { type } ) => {
	return `Error: "${type}" is not a supported field type.`;
}

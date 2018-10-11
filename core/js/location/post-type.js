/**
 * Internal dependencies
 */
import { checkSingleRule } from 'location/rules';
import { areDependenciesMet } from 'state/data/selectors';

/**
 * Checks whether all rules for a post type location are satisfied.
 *
 * @param  {Object} state     The global Redux state.
 * @param  {Object} rules     The rules to check for.
 * @param  {string} storeName The top-level data path.
 * @return {Boolean}          An indicator whether the location is happy.
 */
export default function checkPostTypeRules( state, rules, storeName ) {
	const { supports, levels, dependencies } = rules;
	const { post_level } = state.env;

	if ( supports.levels && ! checkSingleRule( levels, post_level ) ) {
		return false;
	}

	if ( dependencies && ! areDependenciesMet( state, [ storeName ], dependencies ) ) {
		return false;
	}

	return true;
}

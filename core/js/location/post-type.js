import { checkSingleRule } from './rules';

export default function checkPostTypeRules( state, rules ) {
	const { supports, levels } = rules;
	const { post_level } = state.env;

	if ( supports.levels && ! checkSingleRule( levels, post_level ) ) {
		return false;
	}

	return true;
}

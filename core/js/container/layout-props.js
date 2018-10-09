/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
	LAYOUT_ROWS, LAYOUT_GRID,
	DESCRIPTION_IN_LABEL, DESCRIPTION_IN_INPUT,
	STYLE_SEAMLESS, STYLE_BOXED,
} from 'constants';

/**
 * Layout-related props, used within containers,
 * <Fields /> and individual fields.
 */
export default {
	layout: PropTypes.oneOf( [
		LAYOUT_ROWS,
		LAYOUT_GRID,
	] ),
	description_position: PropTypes.oneOf( [
		DESCRIPTION_IN_LABEL,
		DESCRIPTION_IN_INPUT,
	] ),
	style: PropTypes.oneOf( [
		STYLE_SEAMLESS,
		STYLE_BOXED,
	] ),
}

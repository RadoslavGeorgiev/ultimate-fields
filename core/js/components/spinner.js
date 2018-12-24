/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Spinner( { active, className } ) {
	return <span className={ classNames( 'spinner', className, active && 'is-active' ) } />
}

Spinner.propTypes = {
	active: PropTypes.bool,
};

Spinner.defaultProps = {
	active: true,
};
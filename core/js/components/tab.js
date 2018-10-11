/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { areDependenciesMet } from 'state/data/selectors';
import { isTabActive } from 'state/tabs/selectors';
import { changeTab } from 'state/tabs/actions';
import { STYLE_SEAMLESS, STYLE_BOXED } from 'constants';

/**
 * Displays tab buttons.
 */
class Tab extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		icon: PropTypes.string,
		style: PropTypes.oneOf( [ STYLE_SEAMLESS, STYLE_BOXED ] ),
		dataPath: PropTypes.array.isRequired,
		container: PropTypes.string.isRequired,
		dependencies: PropTypes.array,
		invalid: PropTypes.bool,
	}

	/**
	 * Renders the tab.
	 *
	 * @return {React.Element}
	 */
	render() {
		const { label, icon, style, active, invalid, enabled } = this.props;

		const className = classNames( [
			'uf-tab',
			`uf-tab--${style}`,
			active && 'uf-tab--active',
			! enabled && 'uf-tab--disabled',
			invalid && 'uf-tab--invalid',
		] );

		return (
			<a href="#" className={ className } onClick={ this.onClick }>
				{ icon && <span className={ `uf-tab__icon dashicons ${icon}` } /> }
				<span className="uf-tab__text">{ label }</span>
			</a>
		);
	}

	/**
	 * Handles the click event.
	 *
	 * @param {Event} e The event that is being handled.
	 */
	onClick = e => {
		const { active, enabled, onClick } = this.props;

		e.preventDefault();

		if ( enabled && ! active ) {
			onClick();
		}
	}
}

export default connect(
	( state, { dataPath, container, name, dependencies } ) => ( {
		active: isTabActive( state, container, name ),
		enabled: areDependenciesMet( state, dataPath, dependencies ),
	} ),
	( dispatch, { container, name } ) => ( {
		onClick: () => dispatch( changeTab( container, name ) ),
	} )
)( Tab );

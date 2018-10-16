/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class OverlayScreen extends Component {
	static propTypes = {
		isMainScreen: PropTypes.bool.isRequired,
	}

	state = {
		mounted: false,
		animated: false,
	}

	render() {
		const { children, animate, isMainScreen } = this.props;
		const { mounted, animated } = this.state;
		const classes = [ 'uf-overlay__screen' ];

		if ( animate || animated ) {
			classes.push( 'uf-overlay__screen--animated' );
		}

		if ( ! isMainScreen ) {
			classes.push( 'uf-overlay__screen--going-out' );
		} else if ( ! mounted ) {
			classes.push( 'uf-overlay__screen--coming-in' );
		}

		return <div className={ classNames( classes ) }>
			{ children }
		</div>
	}

	componentDidMount() {
		setTimeout( () => {
			this.setState( {
				mounted: true
			} );
		}, 10 );
	}

	componentDidUpdate() {
		if ( this.props.animate && ! this.state.animated ) {
			this.setState( {
				animated: true
			} );
		}
	}
}

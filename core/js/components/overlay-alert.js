/**
 * External dependencies
 */
import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Button from 'components/button';

export default class OverlayAlert extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		buttons: PropTypes.array,
		onClose: PropTypes.func.isRequired,
	}

	static defaultProps = {
		buttons: [ {
			children: 'OK',
		} ],
	}

	state = {
		visible: false,
	};

	render() {
		const { title, children, buttons: buttonDefs } = this.props;
		const { visible } = this.state;

		const buttons = buttonDefs.map( ( button, i ) => {
			return createElement( Button, {
				...button,

				key: i,
				onClick: () => {
					if ( button.onClick ) {
						button.onClick();
					}

					this.close();
				}
			} );
		} );

		return (
			<div className={ classNames( 'uf-alert', visible && 'uf-alert--visible' ) }>
				<div className="uf-alert__background"></div>

				<div className="uf-alert__box">
					<h2 className="uf-alert__title">{ title }</h2>

					<div className="uf-alert__body">
						{ children }
					</div>

					<div className="uf-alert__footer">
						{ buttons }
					</div>
				</div>
			</div>
		);
	}

	componentDidMount() {
		setTimeout( () => {
			this.setState( {
				visible: true,
			} );
		}, 0 );
	}

	close() {
		const { onClose } = this.props;

		this.setState( {
			visible: false,
		} );

		setTimeout( () => {
			onClose();
		}, 300 );
	}
}

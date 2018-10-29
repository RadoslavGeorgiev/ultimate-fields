/**
 * External dependencies
 */
import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Handles the checkbox input.
 */
export default class CheckboxField extends Component {
	static propTypes = {
		value: PropTypes.bool.isRequired,
		text: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		fancy: PropTypes.bool,
	}

	static defaultProps = {
		text: '',
		fancy: false,
	}

	state = {
		focused: false,
	}

	render() {
		const { value, text, onChange, fancy } = this.props;
		const { focused } = this.state;

		const checkbox = (
			<input
				type="checkbox"
				checked={ value }
				onChange={ ( { target: { checked } } ) => onChange( checked ) }
			/>
		);

		// Nothing special in standard mode
		if ( ! fancy ) {
			return (
				<label>
					{ checkbox }
					{ text }
				</label>
			);
		}

		// Some wraps for a toggle
		return (
			<div className={ classNames( [ 'uf-checkbox uf-toggle', focused && 'uf-toggle--focused' ] ) }>
				<label className="uf-toggle__label">
					{ cloneElement( checkbox, {
						className: 'uf-toggle__input',
						ref: this.assignToInput,
					} ) }

					<span className="uf-toggle__wrap wp-ui-highlight">
						<span className="uf-toggle__button" />
					</span>

					{ text }
				</label>
			</div>
		);
	}

	/**
	 * In `fancy` mode the input should receive a
	 * special class when focused, based on state.
	 * 
	 * @param {HTMLElement} input The input to add listeners to.
	 */
	assignToInput = input => {
		const { fancy } = this.props;

		if ( ! fancy || ! input ) {
			return;
		}

		input.addEventListener( 'focus', () => {
			this.setState( { focused: true } );
		} );

		input.addEventListener( 'blur', () => {
			this.setState( { focused: false } );
		} );
	}
}

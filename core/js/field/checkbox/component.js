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
		/**
		* @param  {Object}        props    The props of the input.
	    * @param  {Boolean}       value    The value of the input.
	    * @param  {string}        text     Some text to show next to the input.
	    * @param  {Function}      onChange The main callback.
	    * @param  {Boolean}       fancy    Whether to add CSS to the input.
	    * @return {React.Element}
	    */
	}

	state = {
		focused: false,
	}

	render() {
		const { value, text, onChange, fancy } = this.props;
		const { focused } = this.state;
		console.log(focused);

		const checkbox = <input
			type="checkbox"
			checked={ value }
			onChange={ ( { target: { checked } } ) => onChange( checked ) }
		/>;

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
						ref: 'input',
						onFocus: this.onFocus,
						onBlur: this.onBlur,
					} ) }

					<span className="uf-toggle__wrap wp-ui-highlight">
						<span className="uf-toggle__button" />
					</span>

					{ text }
				</label>
			</div>
		);
	}

	onFocus = () => {
		if ( this.props.fancy ) {
			this.setState( { focused: true } );
		}
	}

	onFocus = () => {
		if ( this.props.fancy ) {
			this.setState( { focused: false } );
		}
	}
}

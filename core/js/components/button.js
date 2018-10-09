/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Generates a button with the right classes.
 *
 * @param  {Object}        props          Props for the button.
 * @param  {string}        props.type     The type of button.
 * @param  {string}        props.icon     A dashicons icon (Optional).
 * @param  {Object}        props.children The text/children of the button.
 * @return {React.Element}
 */
export default function Button( props ) {
	const { type, icon, children } = props;
	
	const cssClasses = classNames( [
		'button-' + type,
		'uf-button',
		'uf-button--' + type,
	] );

	return (
		<button className={ cssClasses } { ...props } type="button">
			{
				icon &&
				<span className="uf-button__icon">
					<span className={ 'dashicons dashicons-' + icon } />
				</span>
			}
			<span className="uf-button__text">{ children }</span>
		</button>
	);
}

Button.propTypes = {
	type: PropTypes.oneOf( [ 'primary', 'secondary' ] ),
	icon: PropTypes.string,
};

Button.defaultProps = {
	type: 'primary',
};

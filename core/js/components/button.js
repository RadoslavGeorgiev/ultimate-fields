import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
	type: PropTypes.string,
	icon: PropTypes.string,
};

Button.defaultProps = {
	type: 'primary',
}

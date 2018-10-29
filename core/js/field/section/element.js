/**
 * Extenral dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Element from 'field/element';

export default class Section extends Element {
	static propTypes = {
		color: PropTypes.string,
	}

	/**
	 * Renders the section.
	 *
	 * @return {React.Element}
	 */
	render() {
		const {
			icon, label, description, color,
			style, layout, classNames: customClasses,
		} = this.props;

		const classes = classNames( [
			'uf-section',
			color && `uf-section--${color}`,
			layout,
			style,
			...customClasses,
		] );

		return (
			<div className={ classes }>
				<h4>
					{ icon && <span className={ icon } /> }
					{ label }
				</h4>

				{ description && <div dangerouslySetInnerHTML={{ __html: description }} /> }
			</div>
		);
	}
}

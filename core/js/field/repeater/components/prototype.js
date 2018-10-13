/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Prototype extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string,
		onClick	: PropTypes.func.isRequired,
	}

	render() {
		const { id, title, description, onClick } = this.props;

		return (
			<div className="uf-prototype">
				<a className="uf-group uf-group--prototype" data-type={ id } onClick={ onClick }>
					<div className="uf-group__header">
						<div className="uf-group__number">
							<strong className="dashicons dashicons-plus"></strong>
						</div>

						<h3 className="uf-group__title">{ title }</h3>
					</div>
				</a>

				{ description && <div dangerouslySetInnerHTML={ { __html: description } } /> }
			</div>
		);
	}
}

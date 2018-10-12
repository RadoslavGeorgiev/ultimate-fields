/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Displays validation errors and a success message when cleared.
 */
export default class ValidationNotice extends Component {
	static propTypes = {
		errors: PropTypes.arrayOf( PropTypes.string ).isRequired,
		message: PropTypes.string.isRequired,
	}

	state = {
		hadErrors: false,
	}

	/**
	 * Renders the component.
	 *
	 * @return {React.Element} The appropriate element.
	 */
	render() {
		const { errors, message } = this.props;
		const { hadErrors } = this.state;

		if ( errors.length > 0 ) {
			return (
				<div className="error uf-error">
					<p><strong>{ uf_l10n.container_issues }</strong></p>
					<ul>
						{ errors.map( ( err, i ) => <li key={ i }>{ err }</li> ) }
					</ul>
				</div>
			);
		}

		if ( hadErrors ) {
			return (
				<div className="notice updated">
					<p>{ message }</p>
				</div>
			);
		}

		return null;
	}

	/**
	 * When the component mounts, this checks whether there
	 * have been any errors at any point.
	 */
	componentDidMount() {
		const { errors } = this.props;

		if ( errors.length ) {
			this.setState( {
				hadErrors: true,
			} );
		}
	}
}

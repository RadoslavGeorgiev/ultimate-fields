/**
 * External dependencies
 */
import React, { Component } from 'react';

export default class ValidationNotice extends Component {
	state = {
		hadErrors: false,
	}

	render() {
		const { errors } = this.props;
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
					<p>{ uf_l10n.container_issues_fixed }</p>
				</div>
			);
		}

		return null;
	}

	componentDidMount() {
		const { errors } = this.props;

		if ( errors.length ) {
			this.setState( {
				hadErrors: true,
			} );
		}
	}
}

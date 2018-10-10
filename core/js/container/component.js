/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import Fields from 'container/fields';

/**
 * Containers handle their fields, as well as environment.
 *
 * @type {Object}
 */
export default class Container extends Component {
	/**
	 * Renders a simple list of fields.
	 *
	 * @return {React.Element}
	 */
	render() {
		return <Fields {...this.props} />
	}
}

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
	static propTypes = {
		// Currently containers don't have specific prop types.
		// Check the propTypes of the Fields component.
	}

	/**
	 * Renders a simple list of fields.
	 *
	 * @return {React.Element}
	 */
	render() {
		return <Fields {...this.props} />
	}
}

/**
 * Extenral dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Fields from 'container/fields';

/**
 * Handles the input of the select field.
 */
export default class SelectField extends Component {
	static propTypes = {
	}

	render() {
		const { name, group, dataPath: basePath, containerPath, style, merge , value} = this.props;
		const { fields, layout } = group;

		const dataPath  = merge ? basePath : [ ...basePath, name ];
		const container = merge ? value : value.__container;

		return <Fields
			fields={ fields }
			dataPath={ dataPath }
			containerPath={ containerPath }
			container={ container }
			style={ style }
			layout={ layout }
			className="uf-fields--complex"
		/>;
	}
}

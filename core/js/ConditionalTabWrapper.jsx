import React from 'react';
import ConditionalLogic from './ConditionalLogic.jsx';
import Parser from './Logic/Parser.js';

export default class ConditionalTabWrapper extends React.Component {
	render() {
		const { children, prepareField } = this.props;

		// When hidden, do not render fields at all
		if( ! ( new Parser( this.props ) ).areRulesSatisfied() ) {
			return null;
		}

		// Check for proper child types
		return children;
	}
}

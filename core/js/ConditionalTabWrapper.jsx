import React from 'react';
import ConditionalLogic from './ConditionalLogic.jsx';
import Parser from './Logic/Parser.js';

export default class ConditionalTabWrapper extends React.Component {
	render() {
		const { children, source, prepareField, getFieldValue } = this.props;

		const parser = new Parser({
			getFieldValue,
			source,
			...this.props.logicProps
		});

		// When hidden, do not render fields at all
		if( ! parser.areRulesSatisfied() ) {
			return null;
		}

		// Check for proper child types
		return children;
	}
}

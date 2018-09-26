import React from 'react';

import Button from './../../components/button';

export default class RepeaterField extends React.Component {
	render() {
		const { renderedGroups } = this.props;

		return (
			<React.Fragment>
				{ renderedGroups }
				<Button type="primary" icon="plus" onClick={ this.addGroup }>Add group</Button>
			</React.Fragment>
		);
	}

	addGroup() {

	}
}

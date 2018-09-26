import React from 'react';

import Container from './../../container/component';

export default class RepeaterGroup extends Container {
	render() {
		return (
			<React.Fragment>
				{ super.render() }
				<hr />
			</React.Fragment>
		)
	}
}

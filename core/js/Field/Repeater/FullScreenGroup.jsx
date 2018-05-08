import React from 'react';
import Container from './../../Container.jsx';

export default class FullScreenGroup extends React.Component {
	render() {
		const { title } = this.props;

		return <Container { ... this.props } display_tabs_wrapper={ true } />
	}
}

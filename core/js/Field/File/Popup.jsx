import React from 'react';
import Button from './../../Button.jsx';
import Overlay from './../../Overlay.jsx';

export default class Popup extends React.Component {
	render() {
		return <div className="uf-overlay__media" ref="wrapper" />
	}

	componentDidMount() {
        const { frame } = this.props;

        frame.modal.on( 'close', function() {
			Overlay.remove();
		});

        // Open the popup
		frame.modal.open();

        this.refs.wrapper.appendChild( frame.modal.el );
        frame.modal.render();
	}
}

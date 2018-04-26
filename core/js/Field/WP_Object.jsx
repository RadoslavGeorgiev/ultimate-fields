import React from 'react';
import Field from './../Field.jsx';
import Button from './../Button.jsx';

export default class WP_Object extends Field {
	state = { loading: false }

	renderInput() {
		const { button_text } = this.props;
		const { loading } = this.state;

		return <React.Fragment>
			<Button
				onClick={ this.openChooser.bind( this ) }
				icon="dashicons-search"
				className="uf-object__select"
				children={ button_text || uf_l10n['select-item'] }
			/>

			{ loading && <span className="spinner is-active uf-object__spinner" /> }
		</React.Fragment>
	}

	openChooser() {
		console.log(this.props);
		const { name, nonce, multiple, value } = this.props;

		this.setState({
			loading: true
		});

		let filters = false, mode = false, page = false;

		const params = {
			uf_action: 'get_objects_' + name,
			nonce:     nonce,
			filters:   Object.assign( { filter: true }, filters || {} ),
			selected:  multiple ? value : [ value ],
			mode:      'search' == mode ? 'search' : 'initial',
			page:      page || 1,
			uf_ajax:   true
		};

		const request = new XMLHttpRequest;
		request.addEventListener( 'load', e => {
			console.log(request.response);
		});
		request.open( 'post', window.location.href );
		request.send( JSON.stringify( params ) );
	}
}

import React from 'react';
import Location from './Location.jsx';
import Form from './../Form.jsx';
import Loader from './../PHP/Loader.jsx';

export default class Options extends Location {
	state: {
		data: {}
	}

	componentWillMount() {
		const { data } = this.props;
		this.setState({ data });
	}

	render() {
		const { element, settings, data } = this.props;
		const { id, fields, layout, description_position } = settings;

		const loader = new Loader( fields );

		// Prepare a tab if available
		if( window.location.hash.match( /^#?tab\// ) ) {
			data.__tab = window.location.hash.replace( /^#?tab\//, '' );
		}

		return <React.Fragment>
			<Form
				data={ data }
				children={ loader.load() }
				ref={ form => this.form = form }
				onChange={ data => this.setData( data ) }
				className="uf-fields--boxed"
				layout={ layout }
				description_position={ description_position }
			/>
			{ this.getHiddenField( 'uf_options_' + id ) }
		</React.Fragment>
	}

	setData( data ) {
		this.setState({ data });

		if( data.__tab ) {
			window.location.hash = '#tab/' + data.__tab;
		}
	}
}

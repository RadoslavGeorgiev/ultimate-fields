import React from 'react';
import Location from './Location.jsx';
import Form from './../Form.jsx';

export default class Options extends Location {
	render() {
		const { settings, data } = this.props;
		const { id } = settings;

		// Prepare a tab if available
		if( window.location.hash.match( /^#?tab\// ) ) {
			data.__tab = window.location.hash.replace( /^#?tab\//, '' );
		}

		return <React.Fragment>
			{ this.renderForm({
				data,
				className: 'uf-fields--boxed'
			}) }

			{ this.getHiddenField( 'uf_options_' + id ) }
		</React.Fragment>
	}

	setData( data ) {
		Location.prototype.setData.apply( this, arguments );

		if( data.__tab ) {
			window.location.hash = '#tab/' + data.__tab;
		}
	}
}

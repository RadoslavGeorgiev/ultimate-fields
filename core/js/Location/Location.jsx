import React from 'react';
import Form from './../Form.jsx';

export default class Location extends React.Component {
	state = {
		data: this.props.data
	}

	/**
	 * Generates a hidden field with the given name, which contains all values of a lication.
	 *
	 * @param  {string} name The name of the hidden input.
	 * @return {React.Element}
	 */
	getHiddenField( name ) {
		const state = JSON.stringify( this.state.data );
		return <input type="hidden" name={ name } value={ state } />
	}

	/**
	 * Renders the form of the location.
	 */
	renderForm( extraProps ) {
		const { element, settings, data } = this.props;
		const { id, fields, layout, description_position } = settings;

		const props = Object.assign( {}, {
			data:                 data,
			children:             fields,
			layout:               layout,
			description_position: description_position,
			onChange:             data => this.setState({ data })
		}, extraProps || {} )

		return React.createElement( Form, props );
	}
}

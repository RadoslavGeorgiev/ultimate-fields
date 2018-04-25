import React from 'react';
import ReactDOM from 'react-dom';

export default class Controller extends React.Component {
	static controllers = {}
	static initialized = {}
	locations = []

	getLocationClass() {
		throw 'All controllers must specify a location class through their getLocationClass method.';
	}

	init({ element, settings, data }) {
		const FormClass = this.getLocationClass();

		ReactDOM.render(
			React.createElement( FormClass, {
				settings,
				data,
				ref: form => this.locations.push( form )
			}),
			element
		);
	}
}

import React from 'react';
import ReactDOM from 'react-dom';
import Controller from './Controller.jsx';
import OptionsLocation from './../Location/Options.jsx';

export default class Options extends Controller {
	getLocationClass() {
		return OptionsLocation;
	}

	constructor() {
		super();

		// Add a submission handler
		const form = document.getElementById( 'poststuff' );
		form.addEventListener( 'submit', this.onSubmit.bind( this ) );
	}

	displayErrors( errors ) {
		const notice = this.generateErrorNotice( errors );

		// Cleanup all success messages and existing UF errors.
		const existing = document.querySelectorAll( '.notice-success, .uf-error' );
		Array.from( existing ).forEach( message => message.parentNode.removeChild( message ) );

		// Create React root element in order to allow rendering
		const wrap = document.createElement( 'div' );
		wrap.classList.add( 'uf-errors' );

		// Put the root element in the right place
		const titleBox = document.querySelector( 'h1' );
		titleBox.parentNode.insertBefore( wrap, titleBox.nextSibling );

		ReactDOM.render(
			notice,
			wrap
		);
	}
}

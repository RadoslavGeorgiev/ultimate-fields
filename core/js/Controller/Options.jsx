import React from 'react';
import ReactDOM from 'react-dom';
import Controller from './Controller.jsx';
import Location from './../Location/Options.jsx';

export default class Options extends Controller {
	getLocationClass() {
		return Location;
	}

	constructor() {
		super();

		const form = document.getElementById( 'poststuff' );

		// Add a submission handler
		form.addEventListener( 'submit', this.onSubmit.bind( this ) );
	}

	onSubmit( e ) {
		const reducer = ( errors, location ) => errors.concat( location.form.validate() )
		const errors  = this.locations.reduce( reducer, [] )

		if( errors.length ) {
			e.preventDefault();
			this.displayErrors( errors );
		} else {
			this.clearErrors();
		}
	}

	displayErrors( errors ) {
		const error = <div className="error uf-error">
			<p><strong>{ uf_l10n['container-issues'] }</strong></p>
			<ul>
				{ errors.map( ( error, i ) => <li key={ i } children={ error } /> ) }
			</ul>
		</div>;

		// Create the div and render it
		let errorWrapper = document.querySelector( '.uf-errors' );
		if( ! errorWrapper ) {
			errorWrapper = document.createElement( 'div' );
			errorWrapper.className = 'uf-errors';

			const titleBox = document.querySelector( 'h1' );
			titleBox.parentNode.insertBefore( errorWrapper, titleBox.nextSibling );
		}

		ReactDOM.render(
			error,
			errorWrapper
		);
	}

	clearErrors() {
		Array.from( document.querySelectorAll( '.uf-errors > *' ) ).forEach( child => {
			child.parentNode.removeChild( child );
		})
	}
}

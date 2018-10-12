/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import Controller from 'controller';

/**
 * Adds the necessary functionality for managing the
 * options page location, incl. validation and etc.
 */
export default class OptionsPage extends Controller {
	/**
	 * Initializes the environment and adds all necessary listeners.
	 */
	initialize() {
		/**
		 * Connect to the form
		 */

		const form = document.querySelector( '#poststuff' );

		const errorWrapper = document.createElement( 'div' );
		const title = document.querySelector( 'h1' );
		title.parentNode.insertBefore( errorWrapper, title.nextSibling );

		form.addEventListener( 'submit', e => {
			if ( this.canBeSaved( errorWrapper ) ) {
				e.preventDefault();
			}
		} );
	}

	/**
	 * Starts an individual instance.
	 *
	 * @param  {DOMElement} wrapper  The wrapper to initialize.
	 * @param  {Object}     settings The settings of the instance.
	 * @param  {Object}     data     The data for the instance (Optional).
	 * @return {Instance}            The new container instance.
	 */
	startInstance( wrapper, settings, data = {} ) {
		const storeName = `options`; // @todo: Add the post ID
		const instance  = this.makeInstance( wrapper, settings, storeName, data );

		// Connect to the "real" world
		instance.useParentNode( wrapper.parentNode.parentNode );

		return instance;
	}
}

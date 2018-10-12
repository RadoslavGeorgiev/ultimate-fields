/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import Controller from 'controller';
import checkPostTypeRules from 'location/post-type';

/**
 * Adds the necessary functionality for managing the
 * post type location, incl. validation and etc.
 */
export default class PostType extends Controller {
	/**
	 * Initializes the environment and adds all necessary listeners.
	 */
	initialize() {
		const { post } = this.args;

		/**
		 * Setup the environment
		 */

		// Directly put the post in the environment
		this.setEnv( 'post', post );

		// Listen for parent IDs
		this.listen( '#parent_id', 'post_parent', value => {
			return parseInt( value ) || 0;
		} );

		// Listen for parent levels
		this.listen( '#parent_id', 'post_level', ( value, el ) => {
			const { className } = find( el.children, { selected: true } );

			if ( ! className ) {
				return 1;
			}

			return parseInt( className.replace( 'level-', '' ) ) + 2;
		} );

		/**
		 * Connet to the form
		 */

		const form = document.getElementById( 'post' );
		const errorWrapper = document.createElement( 'div' );
		document.getElementById( 'titlediv' ).appendChild( errorWrapper );

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
		const storeName = `post`; // @todo: Add the post ID
		const instance  = this.makeInstance( wrapper, settings, storeName, data );

		// Connect to the "real" world
		instance.useParentNode( wrapper.parentNode.parentNode );
		instance.useLocationClass( checkPostTypeRules );

		return instance;
	}
}

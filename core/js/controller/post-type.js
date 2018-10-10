import { find } from 'lodash';

/**
 * Internal dependencies
 */
import Controller from './';
import Instance from 'container/instance';

export default class PostTypeController extends Controller {
	constructor( args, store ) {
		super();

		const { post } = args;

		this.store = store;
		this.post = post;

		this.set( 'post', post );

		this.listen( '#parent_id', 'post_parent', value => {
			return parseInt( value ) || 0;
		} );

		this.listen( '#parent_id', 'post_level', ( value, element ) => {
			const { className } = find( element.children, { selected: true } );

			if ( ! className ) {
				return 1;
			}

			return parseInt( className.replace( 'level-', '' ) ) + 2;
		} );
	}

	getStoreName( settings ) {
		return `post-${this.post}`;
	}

	startInstance( wrapper, settings, data ) {
		const storeName = this.getStoreName( settings );
		const instance = new Instance( wrapper, settings, data, this.store, storeName );

		instance.useParentNode( wrapper.parentNode.parentNode );

		return instance;
	}
}

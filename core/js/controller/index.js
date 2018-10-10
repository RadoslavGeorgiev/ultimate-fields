import { setEnv } from 'state/env/actions';

export default class Controller {
	set( name, value ) {
		this.store.dispatch( setEnv( name, value ) );
	}

	listen( selector, varName, callback ) {
		const element = document.querySelector( selector );

		if ( ! element ) {
			this.set( varName, null );
			return;
		}

		const go = () => {
			this.set( varName, callback( element.value, element ) );
		}

		go();
		element.addEventListener( 'change', go );
	}
}

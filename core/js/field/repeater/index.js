import Input from './component';
import Model from './model';
import reducers from './state/reducers';

export default function( register ) {
	register( 'repeater', {
		Input,
		Model,
		reducers
	} );
}

import Input from './component';
import Model from './model';

export default function( register ) {
	register( 'text', {
		Input,
		Model,
	} );
}

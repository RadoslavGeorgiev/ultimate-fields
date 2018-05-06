import Controller from './Controller.jsx';
import Post_Type from './Post_Type.jsx';
import Options from './Options.jsx';

Controller.controllers = {
	Post_Type,
	Options
}

export default function getController( type ) {
	return Controller.initialized[ type ]
		? ( Controller.initialized[ type ] )
		: ( Controller.initialized[ type ] = new Controller.controllers[ type ] );
}

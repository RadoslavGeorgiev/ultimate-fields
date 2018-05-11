import * as reducers from './../reducers.js';

const values = reducers.values;
reducers.values = function( state, action ) {
	const defaultHandler = () => {
		return values( state, action );
	}

	switch( action.type ) {
		case 'FIELD_BLURRED': {
			// Only act when the label has been changed
			if( 'label' != action.name ) {
				return defaultHandler();
			}

			// Load the label and check the name
			const context = state[ action.context ];
			const { name, label } = context;

			if( name && name.length ) {
				return defaultHandler();
			}

			const diff = {};
			diff[ action.context ] = Object.assign( {}, state[ action.context ] );
			diff[ action.context ].name = label.trim()
				.toLowerCase()
				.replace( /[\s\-]/g, '_' );

			return Object.assign( {}, state, diff );
		}

		default:
			return defaultHandler();
			return values( state, action );
	}
}

export default reducers;

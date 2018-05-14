import repeaterReducer from './Field/Repeater/reducers.js';

export function values( state, action ) {
	const repeaterState = repeaterReducer( state, action );
	if( repeaterState ) {
		return repeaterState;
	}

	switch( action.type ) {
		case 'UPDATE_VALUE':
			const diff = {};
			diff[ action.name ] = action.value;

			const tlDiff = {};
			tlDiff[ action.context ] = Object.assign( {}, state[ action.context ], diff );

			return Object.assign( {}, state, tlDiff );

		case 'CREATE_CONTEXT':
			const context = {};
			context[ action.name ] = action.data || {};
			return Object.assign( {}, state, context );

		case 'CREATE_CONTEXTS':
			return Object.assign( {}, state, action.data );

		case 'DESTROY_CONTEXT': {
			const newState = Object.assign( {}, state );
			delete newState[ action.name ];
			return newState;
		}

		case 'REPLACE_CONTEXTS':
			return Object.assign( {}, state, action.contexts );

		default:
			const newState = state || {
				__: {}
			};

			if( ! newState.__ ) {
				newState.__ = {}
			}

			return newState;
	}
}

export function validation( state, action ) {
	switch( action.type ) {
		case 'SET_VALIDATION_MESSAGE': {
			const diff = {};
			diff[ action.name ] = action.message;

			const updated = Object.assign( {}, state, diff );
			if( ( action.name in updated ) && 'string' != typeof action.message ) {
				delete updated[ action.name ];
			}

			return updated;
		}

		default:
			return state || {};
	}
}

export function cache( state, action ) {
	switch( action.type ) {
		case 'CACHE_VALUE':
			const diff = {}
			diff[ action.name ] = action.value;
			return Object.assign( {}, state, diff );

		default:
			return state || {}
	}
}

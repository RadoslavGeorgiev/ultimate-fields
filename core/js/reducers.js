export function values( state, action ) {
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

		case 'ADD_REPEATER_ROW':
			const repeaterDiff = {};
			repeaterDiff[ action.name ] = ( state[ action.name ] || [] ).concat( action.index );
			return Object.assign( {}, state, repeaterDiff );

		case 'DELETE_REPEATER_ROW': {
			const diff = {};
			diff[ action.name ] = state[ action.name ].filter( row => row !== action.index );

			return Object.assign( {}, state, diff );
		}

		case 'CLONE_CONTEXT': {
			const diff = {};
			diff[ action.to ] = Object.assign( {}, state[ action.from ], action.changes || {} );
			return Object.assign( {}, state, diff );
		}

		case 'UPDATE_REPEATER_ORDER': {
			const diff = {};

			// Save the value of the repeater
			diff[ action.name ] = action.order;

			// Update the order
			action.order.map( ( index, position ) => {
				const key = name + '_' + index;
				diff[ key ] = Object.assign( {}, state[ key ], {
					__index: position
				});
			});

			return Object.assign( {}, state, diff );
		}

		case 'REPLACE_CONTEXTS':
			return Object.assign( {}, state, action.contexts );

		case 'TOGGLE_REPEATER_GROUP': {
			const diff = {}
			diff[ action.name ] = Object.assign( {}, state[ action.name ], {
				__hidden: ! state[ action.name ].__hidden
			});

			return Object.assign( {}, state, diff );
		}

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

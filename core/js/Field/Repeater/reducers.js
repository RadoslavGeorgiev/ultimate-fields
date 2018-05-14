import _ from 'lodash';
import StoreParser from './../../StoreParser.js';

export default function repeaterReducer( state, action ) {
    switch( action.type ) {
        case 'ADD_REPEATER_GROUP': {
            const { field, source, group } = action;

            // Manipulate the basic value of the field
            const value = ( state[ source ] || {} )[ field ].concat([]) || [];
            const index  = value.length ? Math.max( ...value.map( row => row.index ) ) + 1 : 0;

            value.push({
                index:  index,
                type:   group.type,
                hidden: false
            });

            // Create and update the context
            const context = {};
            context[ field ] = value;

            const newState = Object.assign( {}, state );
            newState[ source ] = Object.assign( {}, state[ source ], context );

            // Create a new context
            const parser      = new StoreParser();
            const namespace   = `${source}_${field}_${index}`;
            const subContexts = parser.prepareDataForStore( {}, group.children, namespace );

            Object.assign( newState, subContexts );

            return newState;
        }

        case 'DELETE_REPEATER_GROUP': {
            const { field, source, index } = action;
            const newContexts = {};
            const prefix = `${source}_${field}_${index}`;

            // Clean up the contexts
            _.forEach( state, ( context, name ) => {
                if( 0 !== name.indexOf( prefix ) ) {
                    newContexts[ name ] = context;
                }
            });

            // Update the value
            const rows = newContexts[ source ][ field ].filter( row => row.index != index );

            const diff = {};
            diff[ field ] = rows;
            newContexts[ source ] = Object.assign( {}, newContexts[ source ], diff );

            return newContexts;
        }

        case 'TOGGLE_REPEATER_GROUP': {
            const { field, source, index } = action;

            const value = state[ source ][ field ].map( row => {
                return row.index !== index
                    ? row
                    : Object.assign( {}, row, {
                        hidden: ! row.hidden
                    });
            });

            const values = {};
            values[ field ] = value;
            const context = Object.assign( {}, state[ source ], values );

            const diff = {};
            diff[ source ] = context;
            return Object.assign( {}, state, diff );
        }

        case 'CLONE_REPEATER_GROUP': {
            const { field, source, group, index } = action;

            // Export the data
            const parser    = new StoreParser();
            const namespace = `${source}_${field}_${index}`;
            const data      = parser.extractDataFromState( state, group.children, namespace );
            const oldGroup  = state[ source ][ field ].find( row => row.index === index );

            // Create a new index
            const value = ( state[ source ] || {} )[ field ].concat([]) || [];
            const newIndex  = value.length ? Math.max( ...value.map( row => row.index ) ) + 1 : 0;

            // Merge the stores
            const clonedNamespace = `${source}_${field}_${newIndex}`;
            const stores = parser.prepareDataForStore( data, group.children, clonedNamespace );
            const newState = Object.assign( {}, state, stores );

            // Update the value
            const newValue = [];
            _.forEach( value, row => {
                newValue.push( row );

                if( row.index === index ) {
                    newValue.push({
                        type:   group.type,
                        hidden: oldGroup.hidden,
                        index:  newIndex
                    });
                }
            });

            const diff = {};
            diff[ field ] = newValue;
            newState[ source ] = Object.assign( {}, state[ source ], diff );

            return Object.assign( {}, state, newState );
        }

        case 'POPULATE_REPEATER_PLACEHOLDERS': {
            const { field, source, value, groups } = action;

            // Prepare some basics
            const parser    = new StoreParser();
            const index     = value.length ? Math.max( ...value.map( row => row.index || -1 ) ) + 1 : 0;
            const namespace = `${source}_${field}_${index}`;
            let group       = null;

            // Replace the placeholder
            const updatedValue = value.map( row => {
                if( null !== row.index ) {
                    return row;
                }

                // Map the group
                group = groups.find( group => group.type === row.type );

                return {
                    type: row.type,
                    index,
                    hidden: false
                };
            });

            // If there is no group, there is no placeholder.
            if( ! group ) {
                return;
            }

            // Update the context
            const context = {};
            const diff = {}
            diff[ field ] = updatedValue;
            context[ source ] = Object.assign( {}, state[ source ], diff );

            // Merge the stores
            const stores = parser.prepareDataForStore( {}, group.children, namespace );
            Object.assign( context, stores );

            return context;
        }
    }
}

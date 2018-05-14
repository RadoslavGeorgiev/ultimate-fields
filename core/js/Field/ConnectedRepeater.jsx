import { createStore, combineReducers, bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import _ from 'lodash';

import * as reducers from './../reducers.js'
import * as repeaterActions from './Repeater/actions.jsx';
import Repeater from './Repeater.jsx';
import StoreParser from './../StoreParser.js';

const mapStateToProps = ( state, ownProps ) => {
    const getValueFromContext = ( context, name ) =>  {
        return ( state.values[ context ] || {} )[ name ];
    }

    return {
        value: state.values[ ownProps.source ][ ownProps.name ] || [],
        getValueFromContext
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators( repeaterActions, dispatch );
}

const Connected = connect( mapStateToProps, mapDispatchToProps )( Repeater );

export default class ConnectedRepeater extends Connected {
    /**
     * Returns all contexts (sub-stores) for the repeater field.
     *
     * @param  {Class}         type   The class of the field.
     * @param  {React.Element} field  The descriptor of the field.
     * @param  {Array}         data   The data for the field.
     * @param  {string}        source The context of the field.
     * @return {Object}
     */
    static getStores( type, field, data, source ) {
        const { name } = field.props;

        // Prepare all context data
        const groups = Repeater.getGroups( field );
        const rows   = data[ name ] || [];
        const parser = new StoreParser;
        const value  = [];
        const stores = {};

		// Map each row to a store
		rows.forEach( ( row, index ) => {
            const type   = row.__type || Repeater.DEFAULT_GROUP_TYPE;
            const group  = groups.find( group => group.type === type );
            const prefix = `${source}_${name}_${index}`;

            Object.assign(
                stores,
                parser.prepareDataForStore( row, group.children, prefix )
            );

            value.push({
                type,
                index,
                hidden: !! row.__hidden
            });
        });

        // Save the value
        stores[ source ] = stores[ source ] || {}
        stores[ source ][ name ] = value;

		return stores;
	}

    /**
     * Extracts the data from a store as an object, which will be send to PHP.
     *
     * @param  {Object}        state  The current state of the store.
     * @param  {Class}         type   The type class of the field.
     * @param  {React.Element} field  The descriptor of the field.
     * @param  {string}        source A context for the value.
     * @return {Array}
     */
    static getDataFromState( state, type, field, source ) {
		const { name } = field.props;

        // Prepare all context data
		const groups = Repeater.getGroups( field );
        const value  = state[ source ][ name ] || [];
        const parser = new StoreParser;

        // Transform each individual row
		const rows = value.map( row => {
            const { index, type, hidden } = row;

            const group     = groups.find( group => group.type == type );
            const prefix    = `${source}_${name}_${index}`;
            const extracted = parser.extractDataFromState( state, group.children, prefix );

			Object.assign( extracted, {
				__type:   type,
				__hidden: hidden
			});

            return extracted;
		});

        // Create the proper object and return it
        const data = {};
		data[ name ] = rows;
		return data;
	}
}

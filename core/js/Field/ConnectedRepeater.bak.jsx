import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import _ from 'lodash';
import Repeater from './Repeater.jsx';
import * as reducers from './../reducers.js'
import StoreParser from './../StoreParser.js';

import {
	createContexts,
	addRepeaterRow,
	deleteRepeaterRow,
	destroyContext,
	cloneContext,
	updateRepeaterOrder,
	replaceContexts,
	toggleRepeaterGroup
} from './../actions.js';

const mapStateToProps = ( { values: state }, ownProps ) => {
	const prefix = ownProps.source + '_' + ownProps.name;
	const value  = state[ prefix ] || [];

	const types = value.map( index => {
		return state[ prefix + '_' + index ].__type || Repeater.DEFAULT_REPEATER_GROUP_TYPE;
	});

	const visibility = value.map( index => {
		return ! state[ prefix + '_' + index ].__hidden
	});

	return {
		value,
		types,
		visibility,
		getGroupData: ( prefix, children ) => ( new StoreParser ).extractDataFromState( state, children, prefix )
	}
}

const mapDispatchToProps = dispatch => ({
	onCreateContexts:       ( data )              => dispatch( createContexts( data ) ),
	onDestroyContext:       ( name )              => dispatch( destroyContext( name ) ),
	onAddRepeaterRow:       ( name, index )       => dispatch( addRepeaterRow( name, index ) ),
	onDeleteRepeaterRow:    ( name, index )       => dispatch( deleteRepeaterRow( name, index ) ),
	onCloneContext:         ( from, to, changes ) => dispatch( cloneContext( from, to, changes ) ),
	onReplaceContexts:      ( contexts )          => dispatch( replaceContexts( contexts ) ),
	onUpdatedRepeaterOrder: ( name, order )       => dispatch( updateRepeaterOrder( name, order ) ),
	onToggleGroup:          ( name )              => dispatch( toggleRepeaterGroup( name ) )
});

export default connect( mapStateToProps, mapDispatchToProps )( Repeater );

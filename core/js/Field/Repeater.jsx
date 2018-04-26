import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import * as reducers from './../reducers.js'
import StoreParser from './../StoreParser.js';
import repeaterValidator from './../validators/repeater.js';
import Field from './../Field.jsx';
import RepeaterGroup from './../Container/RepeaterGroup.jsx';
import FullScreenGroup from './../Container/FullScreenGroup.jsx';
import Button from './../Button.jsx';

import {
	createContext,
	addRepeaterRow,
	deleteRepeaterRow,
	destroyContext,
	cloneContext,
	updateRepeaterOrder,
	replaceContexts,
	toggleRepeaterGroup
} from './../actions.js';

const DEFAULT_REPEATER_GROUP_TYPE = 'entry';

const mapStateToProps = ( { values: state }, ownProps ) => {
	const prefix = ownProps.source + '_' + ownProps.name;
	const value  = state[ prefix ] || [];

	const types = value.map( index => {
		return state[ prefix + '_' + index ].__type || DEFAULT_REPEATER_GROUP_TYPE;
	});

	const visibility = value.map( index => {
		return ! state[ prefix + '_' + index ].__hidden
	});

	return {
		value,
		types,
		visibility,
		getGroupData: prefix => ( new StoreParser ).extractDataFromState( state, prefix )
	}
}

const mapDispatchToProps = dispatch => ({
	onCreateContext:        ( name, data )        => dispatch( createContext( name, data ) ),
	onDestroyContext:       ( name )              => dispatch( destroyContext( name ) ),
	onAddRepeaterRow:       ( name, index )       => dispatch( addRepeaterRow( name, index ) ),
	onDeleteRepeaterRow:    ( name, index )       => dispatch( deleteRepeaterRow( name, index ) ),
	onCloneContext:         ( from, to, changes ) => dispatch( cloneContext( from, to, changes ) ),
	onReplaceContexts:      ( contexts )          => dispatch( replaceContexts( contexts ) ),
	onUpdatedRepeaterOrder: ( name, order )       => dispatch( updateRepeaterOrder( name, order ) ),
	onToggleGroup:          ( name )              => dispatch( toggleRepeaterGroup( name ) )
});

class Repeater extends Field {
	/**
	 * Collects all group types before mounting the component.
	 */
	componentWillMount() {
		const { children } = this.props;

		this.groups = [];

		React.Children.map( children, child => {
			if( RepeaterGroup === child.type ) {
				this.groups.push({ ...child.props });
			} else {
				this.getGenericGroup().children.push( child );
			}
		});
	}

	/**
	 * Generates a generic group for when there are no specific groups defined.
	 *
	 * @return <Object>
	 */
	getGenericGroup() {
		if( this.genericGroup ) {
			return this.genericGroup;
		}

		this.genericGroup = {
			type: 'entry',
			title: 'Entry',
			children: []
		}

		this.groups.push( this.genericGroup );

		return this.genericGroup;
	}

	/**
	 * Returns a group, which should be used by default.
	 *
	 * @return <Object>
	 */
	getDefaultGroup() {
		return this.groups.find( () => true );
	}

	/**
	 * Renders the input of the field.
	 *
	 * @return <React.Component>
	 */
	renderInput() {
		const { name, types, visibility, value, children, source } = this.props;

		const entries = value.map( ( index, i ) => {
			const type = this.groups.find( group => group.type == types[ i ] ) || this.getDefaultGroup();

			return React.createElement( RepeaterGroup, {
				...type,

				key:          index,
				index:        index,
				hidden:       ! visibility[ index ],
				source:       `${source}_${name}_${index}`,
				position:     i+1,
				onDelete:     () => this.deleteGroup( index ),
				onClone:      () => this.cloneGroup( index ),
				onFullScreen: () => this.openFullScreen( index, type.type ),
				onToggle:     () => this.onToggle( index )
			});
		});

		const buttons = this.groups.length === 1
			? <Button onClick={ this.addGroupClicked.bind( this ) }>Add entry</Button>
			: this.groups.map( group => React.createElement( Button, {
				key:      group.type,
				onClick:  e => this.addGroupClicked( e, group.type ),
				children: 'Add ' + group.title
			}));

		return <div className="uf-repeater">
			<div className="uf-repeater__groups" ref={ node => this.groupsNode = node }>
				{ entries }
			</div>

			{ buttons }
		</div>
	}

	componentDidMount() {
		jQuery( this.groupsNode ).sortable({
			axis:   'y',
			handle: '.uf-group__header',
			stop:   this.saveSort.bind( this ),
			forcePlaceholderSize: true
		});
	}

	saveSort() {
		const { source, name, onUpdatedRepeaterOrder } = this.props;

		const order = Array.from( this.groupsNode.children ).map( group => {
			return parseInt( group.dataset.index );
		});

		onUpdatedRepeaterOrder( `${source}_${name}`, order );
	}

	addGroup( type ) {
		const { name, value, source, onAddRepeaterRow, onCreateContext } = this.props;

		// Get a new index for the group
		const index = value.length ? Math.max( ...value ) + 1 : 0;

		// Create a new context
		onCreateContext( `${source}_${name}_${index}`, {
			__index: index,
			__type:  type || DEFAULT_REPEATER_GROUP_TYPE
		});

		// Update the value of the field
		onAddRepeaterRow( `${source}_${name}`, index );
	}

	addGroupClicked( e, type ) {
		e.preventDefault();
		this.addGroup( type );
	}

	getDefaultValue() {
		return [];
	}

	deleteGroup( index ) {
		const { name, source, onDeleteRepeaterRow, onDestroyContext } = this.props;

		// Destroy the context
		onDestroyContext( `${source}_${name}_${index}` );

		// Remove the repeater row
		onDeleteRepeaterRow( `${source}_${name}`, index );
	}

	cloneGroup( sourceIndex ) {
		const { name, value, source, onCloneContext, onUpdatedRepeaterOrder, onValueChanged } = this.props;

		// Get a new index for the group
		const index   = value.length ? Math.max( ...value ) + 1 : 0;
		const ordered = value.splice( 0, value.indexOf( sourceIndex ) ) // Beginning
			.concat([ index ]) // Injected
			.concat( value ); // Older

		// Clone the existing context
		onCloneContext( `${source}_${name}_${sourceIndex}`, `${source}_${name}_${index}` );

		// Sort the stores
		onUpdatedRepeaterOrder( `${source}_${name}`, ordered );
	}

	openFullScreen( index, type ) {
		const { name, source, children, getGroupData, onReplaceContexts } = this.props;
		const parser = new StoreParser;

		const domNode = document.createElement( 'div' );
		document.body.appendChild( domNode );

		const store = createStore(
			combineReducers( reducers ),
			{
				values: parser.prepareDataForStore( getGroupData( `${source}_${name}_${index}` ), '__' )
			}
		);

		const saveState = () => {
			// Extract the data from the store and convert it to the proper format
			const extracted = parser.extractDataFromState( store.getState().values, '__' );
			const converted = parser.prepareDataForStore( extracted, `${source}_${name}_${index}` );

			onReplaceContexts( converted );
		}

		const destroy = () => {
			ReactDOM.unmountComponentAtNode( domNode );
			document.body.removeChild( domNode );
		}

		ReactDOM.render(
			<Provider store={ store }>
				<FullScreenGroup
					{ ...this.groups.find( group => group.type === type ) }
					source="__"
					onClose={ () => destroy() }
					onSave={ () => { saveState(); destroy() } }
				/>
			</Provider>,
			domNode
		);
	}

	onToggle( index ) {
		const { name, source, onToggleGroup } = this.props;
		onToggleGroup( `${source}_${name}_${index}` );
	}

	static getValidator() {
		return repeaterValidator;
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( Repeater );

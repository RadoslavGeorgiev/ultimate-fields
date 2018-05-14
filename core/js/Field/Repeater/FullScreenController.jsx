import React from 'react';
import _ from 'lodash';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import * as reducers from './../../reducers.js';
import validateFields from './../../validators/validateFields.js';
import Overlay from './../../Overlay.jsx';
import StoreParser from './../../StoreParser.js';
import Button from './../../Button.jsx';
import FullScreenGroup from './FullScreenGroup.jsx';

/**
 * Helps repeater with the control over full-screen groups.
 */
export default class FullScreenController {
	stateSaved = false;

	constructor( row, props, groups ) {
		// Top-level vars
		this.row    = row;
		this.props  = props;
		this.group  = groups.find( group => group.type === row.type );
		this.parser = new StoreParser;
		this.prefix = `${props.source}_${props.name}_${row.index}`

		// Quick access
		this.extract = this.parser.extractDataFromState.bind( this.parser );
		this.prepare = this.parser.prepareDataForStore.bind( this.parser );

		// Action!
		this.store = this.generateStore();
		this.show();
	}

	show() {
		const { title } = this.group;
		const check = this.checkForChanges.bind( this );

		const fragment = <React.Fragment>
			<Overlay.Title>{ 'Edit ' + title }</Overlay.Title>

			<Overlay.Footer>
				<Button onClick={ this.saveState.bind( this ) }>Save</Button>
				<Button onClick={ Overlay.remove }>Close</Button>
			</Overlay.Footer>

			<Provider store={ this.store } key={ Math.random() } onLeave={ check }>
				<FullScreenGroup { ...this.group } source="__"></FullScreenGroup>
			</Provider>
		</React.Fragment>;

		Overlay.show( fragment );
	}

	generateStore() {
		const { getContexts } = this.props;
		const { children } = this.group;

		// Get the existing data
		const contexts = getContexts( this.prefix );

		// Convert to a tree and back to stores
		const extracted = this.extract( contexts, children, this.prefix );
		const values    = this.prepare( extracted, children, '__' );

		// Save for comparison
		this.initialValues = values;

		return createStore( combineReducers( reducers ), { values } )
	}

	saveState() {
		const { replaceContexts } = this.props;
		const { children } = this.group;

		// Start with validation
		const errors = validateFields( this.store, children );
		if( errors.length ) {
			return this.displayErrors( errors );
		}

		// Extract the data from the store and convert it to the proper format
		const extracted = this.extract( this.store.getState().values, children, '__' );
		const converted = this.prepare( extracted, children, this.prefix );

		// Save
		replaceContexts( converted );
		this.stateSaved = true;

		Overlay.remove();
	}

	checkForChanges() {
		if( this.stateSaved ) {
			return false;
		}

		const initialValues = this.initialValues;
		const currentValues = this.store.getState().values;

		if( _.isEqual( initialValues, currentValues ) ) {
			return false;
		}

		return 'You have already made some changes and if you navigate away, all of them will be lost.';
	}

	displayErrors( errors ) {
		const title    = 'There seem to be some issues with your settings:';
		const message  = 'Please correct those errors and try saving the field again.';
		const messages = errors.map( ( message, i ) => {
			return <li key={ i }>{ message }</li>
		});

		Overlay.show( <Overlay.Alert title={ title }>
			<ul>{ messages }</ul>
			<p>{ message }</p>
		</Overlay.Alert> );
	}
}

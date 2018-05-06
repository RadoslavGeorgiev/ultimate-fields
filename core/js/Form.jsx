import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Container from './Container.jsx';
import StoreParser from './StoreParser.js';
import * as reducers from './reducers.js';
import getFieldType from './fields.js';
import { isEqual } from 'lodash';
import validateField from './validators/validateField.js';

window.react = React;

export default class Form extends React.Component {
	state = { errors: [] }

	render() {
		const { children, className, layout, description_position } = this.props;

		return <React.Fragment>
			<Provider store={ this.store }>
				<Container source="__" className={ className } layout={ layout } description_position={ description_position }>
					{ children }
				</Container>
			</Provider>
		</React.Fragment>
	}

	componentWillMount() {
		const { data, children } = this.props;
		const parser = new StoreParser;

		const store = this.store = window.theLastForm = createStore(
			combineReducers( reducers ),
			{
				values: parser.prepareDataForStore( data, children, '__' )
			}
		);

		this.unsubscribe = store.subscribe( () => {
			const extracted = parser.extractDataFromState( store.getState().values, children, '__' );
			this.props.onChange( extracted );
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	validate() {
		const { children } = this.props;
		let errors = [];

		React.Children.forEach( children, child => {
			const state = validateField( child, this.store, '__' );
			errors = errors.concat( state );
		});

		this.setState({
			errors: errors
		});

		return errors;
	}

	renderValidationErrors() {
		const { errors } = this.state;

		if( ! errors.length ) {
			return null;
		}

		return <div className="errors">
			{ errors.map( ( message, i ) => <p key={ i } children={ message } /> ) }
		</div>
	}
}

import React from 'react';
import validateField from './validators/validateField.js';
import Parser from './Logic/Parser.js';
import Rule from './Logic/Rule.jsx';
import Group from './Logic/Group.jsx';

export default class ConditionalLogic extends React.Component {
	/**
	 * Render the actual fields if rules are satisfied.
	 */
	render() {
		const { children, prepareField } = this.props;

		// When hidden, do not render fields at all
		if( ! ( new Parser( this.props ) ).areRulesSatisfied() ) {
			return null;
		}

		// Check for proper child types
		return React.Children.map( children, child => {
			if( child && ( child.type !== Rule && child.type !== Group ) ) {
				return prepareField( child )
			}
		});
	}

	static getValidator = () => {
		return ( store, field, source ) => {
			const parser = new Parser( Object.assign( {}, field.props, {
				source: source,
				getFieldValue: ( context, name ) => {
					return store.getState().values[ context ][ name ]
				}
			}));

			if( ! parser.areRulesSatisfied() ) {
				return [];
			}

			let errors = [];

			React.Children.forEach( field.props.children, child => {
				if( child.type === Rule || child.type === Group ) {
					return;
				}

				errors = errors.concat( validateField( child, store, source ) );
			});

			return errors;
		}
	}
}

ConditionalLogic.Rule = Rule;
ConditionalLogic.Group = Group;

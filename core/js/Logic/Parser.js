import React from 'react';
import Rule from './Rule.jsx';
import Group from './Group.jsx';

export default class Parser {
	constructor( props ) {
		// Simulate a React component
		this.props = props;

		const { field, value, operator, children } = this.props;
		const { prepareRule } = this;
		const { map } = React.Children;
		const groups = this.groups = [];

		// Use props for rules
		if( field ) groups.push([
			prepareRule({
				field, operator, value
			})
		]);

		// Check for ungroupped rules
		let genericGroup;
		map( children, child => {
			if( child && Rule === child.type ) {
				if( ! genericGroup ) {
					groups.push( genericGroup = [] );
				}

				genericGroup.push( prepareRule( child.props ) );
			}
		});

		// Check for groups of rules
		map( children, child => {
			if( child && Group === child.type ) {
				const rules = child.props.children;
				groups.push( map( rules, rule => prepareRule( rule.props ) ) )
			}
		});
	}

	/**
	 * Prepares a rule by adding some defaults.
	 */
	prepareRule( rule ) {
		return {
			field:    rule.field    || '',
			operator: 'undefined' != typeof rule.operator ? rule.operator : '=',
			value:    'undefined' != typeof rule.value    ? rule.value    : true
		}
	}

	/**
	 * Check all rules.
	 */
	areRulesSatisfied() {
		let satisfied = false;

			this.groups.forEach( group => {
			let groupSatisfied = true;

			group.forEach( rule => {
				if( ! this.checkRule( rule ) ) {
					groupSatisfied = false;
				}
			});

			if( groupSatisfied ) {
				satisfied = true;
			}
		})

		return satisfied;
	}

	/**
	 * Checks an individual rule.
	 */
	checkRule( rule ) {
		const { source, getFieldValue }  = this.props;
		const { field, value, operator } = rule;

		// Load the value that we should be working with
		const target = getFieldValue( source, rule.field );

		// Check
		switch( operator ) {
			case '!=': return target != value;
			default:   return target == value;
		}
	}
}

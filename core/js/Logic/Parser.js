import React from 'react';
import Rule from './Rule.jsx';
import Group from './Group.jsx';
import _ from 'lodash';

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
		let target = getFieldValue( source, rule.field );

		// Check
		let valid = true;

		if( ( 'object' == typeof target ) && -1 != [ '>=', '<=', '>', '<', '=', '==' ].indexOf( operator ) ) {
			target = target.length;
		} else if( 'undefined' == typeof target ) {
			target = false;
		}

		switch( operator.toUpperCase() ) {
			case '>=':
				if( ( typeof( value ) == 'number' ) || ( typeof( value ) == 'string' ) ) {
					valid = parseFloat( target ) >= parseFloat( value );
				} else {
					valid = target.length >= parseInt( value );
				}
				break;

			case '<=':
				if( ( typeof( value ) == 'number' ) || ( typeof( value ) == 'string' ) ) {
					valid = parseFloat( target ) <= parseFloat( value );
				} else {
					valid = target.length <= parseInt( value );
				}
				break;

			case '<':
				if( ( typeof( value ) == 'number' ) || ( typeof( value ) == 'string' ) ) {
					valid = parseFloat( target ) < parseFloat( value );
				} else {
					valid = target.length < parseInt( value );
				}
				break;

			case '>':
				if( ( typeof( value ) == 'number' ) || ( typeof( value ) == 'string' ) ) {
					valid = parseFloat( target ) > parseFloat( value );
				} else {
					valid = target.length > parseInt( value );
				}
				break;

			case '!=':
				valid = target != value;
				break;

			case 'NOT_NULL':
				valid = ( target == false || ! target || ( ( 'string' == typeof target ) && 'false' === target ) ) ? false : true;
				break;

			case 'NULL':
				if( 'object' == typeof target ) {
					valid = 0 === target.length;
				} else {
					valid = !target;
				}
				break;

			case 'IN':
				if( ! target ) {
					valid = false;
				} else {
					if( target.indexOf( ',' ) != -1 ) {
						var i, parts = target.split( ',' );
						valid = false;
						for( i in parts ) {
							if( value.indexOf( parts[i] ) != -1 )
								valid = true;
						}
					} else {
						valid = value.indexOf( target ) != -1;
					}
				}
				break;

			case 'NOT_IN':
				if( target.indexOf( ',' ) != -1 ) {
					var i, parts = target.split( ',' );
					valid = false;
					for( i in parts ) {
						if( value.indexOf( parts[i] ) != -1 )
							valid = true;
					}
				} else {
					valid = value.indexOf( target ) == -1;
				}
				break;

			case 'CONTAINS':
				if( 'object' != typeof value ) {
					valid = target && ( 'object' == typeof target ) && -1 != target.indexOf( value );
				} else {
					var i;
					valid = false;

					_.each( target, function( subValue ) {
						if( -1 != value.indexOf( subValue ) ) {
							valid = true;
						}
					});
				}
				break;

			case 'DOES_NOT_CONTAIN':
				if( 'object' != typeof value ) {
					valid = ! target || ( 'object' != typeof target ) || -1 == target.indexOf( value );
				} else {
					var i;
					valid = true;

					_.each( target, function( subValue ) {
						if( _.contains( value, subValue ) ) {
							valid = false;
						}
					});
				}

				break;

			case 'CONTAINS_GROUP':
				valid = false;
				if( 'object' == typeof target ) _.each( target, function( group ) {
					if( ( 'object' == typeof group ) && ( '__type' in group ) && value == group.__type ) {
						valid = true;
					} else if( ( 'object' == typeof group ) && group[ 0 ] && ( '__type' in group[ 0 ] ) ) {
						_.each( group, function( row ) {
							if( value == row.__type ) {
								valid = true;
							}
						})
					}
				});
				break;

			case 'DOES_NOT_CONTAIN_GROUP':
			valid = true;
				if( 'object' == typeof target ) _.each( target, function( group ) {
					if( ( 'object' == typeof group ) && ( '__type' in group ) && value == group.__type ) {
						valid = false;
					} else if( ( 'object' == typeof group ) && group[ 0 ] && ( '__type' in group[ 0 ] ) ) {
						_.each( group, function( row ) {
							if( value == row.__type ) {
								valid = false;
							}
						})
					}
				});
				break;

			default:
			case '=':
			case '==':
				if( ( 'string' == typeof value ) && ( 'object' == typeof target ) && 'length' in target ) {
					valid = target.indexOf( value ) != -1;
				} else {
					valid = target == value;
				}
				break;
		}

		return valid;
	}
}

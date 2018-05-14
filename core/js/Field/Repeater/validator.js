import React from 'react';
import Group from './Group.jsx';
import Repeater from './../Repeater.jsx';
import validateField from './../../validators/validateField.js';

export default function repeaterValidator( store, field, source ) {
	const groups = Repeater.getGroups( field );
	let errors   = [];

	// Go through each group
	const { name, label }   = field.props;
	const { values: state } = store.getState();

	// Locate the basic value
	const value = state[ source ][ name ] || [];

	// Validate counts
	const { minimum, maximum } = field.props;

	if( minimum && value.length < minimum ) {
		return [ label + ' contains less than the required amount of ' + minimum + ' entries.' ];
	};

	if( maximum && value.length > maximum ) {
		return [ label + ' contains more than the allowed amount of ' + maximum + ' entries.' ];
	}

	// Validate subfields
	value.forEach( row => {
		const group = groups.find( group => group.type === row.type );

		if( ! group ) {
			return;
		}

		group.children.forEach( field => {
			const state = validateField( field, store, source + '_' + name + '_' + row.index );
			errors = errors.concat( state );
		});
	});

	if( errors.length > 0 ) {
		return [ label + ' contains fields with invalid values.'];
	} else {
		return []
	}
}

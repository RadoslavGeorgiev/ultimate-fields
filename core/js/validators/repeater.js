import React from 'react';
import Group from './../Field/Repeater/Group.jsx';
import validateField from './validateField.js';

const DEFAULT_REPEATER_GROUP_TYPE = 'entry';

export default function repeaterValidator( store, field, source ) {
	const groups = {};
	const generic = [];
	let errors  = [];

	// Prepare the groups for validation
	React.Children.forEach( field.props.children, child => {
		if( Group === child.type ) {

			groups[ child.props.type ] = child.props.children.map
				? child.props.children.map( el => el )
				: React.Children.map( child.props.children, el => el );
		} else {
			generic.push( child );
		}
	});

	if( generic.length > 0 ) {
		groups[ DEFAULT_REPEATER_GROUP_TYPE ] = generic;
	}

	// Go through each group
	const { name, label }   = field.props;
	const { values: state } = store.getState();

	( state[ source + '_' + name ] || [] ).forEach( index => {
		const values = state[ `${source}_${name}_${index}` ];
		const type   = values.__type || DEFAULT_REPEATER_GROUP_TYPE;
		const group  = groups[ type ];

		if( ! group ) {
			return;
		}

		group.forEach( field => {
			const state = validateField( field, store, source + '_' + name + '_' + index );
			errors = errors.concat( state );
		})
	});

	if( errors.length > 0 ) {
		return [ label + ' contains fields with invalid values.'];
	} else {
		return []
	}
}

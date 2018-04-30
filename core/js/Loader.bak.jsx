import React from 'react';
import Field from './Field.jsx';
import Tab from './Tab.jsx';
import RepeaterGroup from './Container/RepeaterGroup.jsx';

function Placeholder( props ) { this.props = props; }

export default class Loader {
	constructor( source ) {
		this.source = source;
		this.fields = [];
		this.tree   = [ this.fields ];
	}

	load() {
		this.generateFields( this.source );
		console.log(this.tree);
		return this.tree;
	}

	addToCurrentBrach( element ) {
		// Push to the right place
		const currentBranch = this.tree[ this.tree.length - 1 ];

		if( 'function' == typeof currentBranch.push ) {
			currentBranch.push( element );
		} else {
			currentBranch.children.push( element );
		}
	}

	generateFields( source ) {
		source.forEach( field => {
			if( 'Tab' === field.type ) {
				const tab = new Placeholder( Object.assign( {}, field, {
					children: [],
					key: field.name
				}));

				this.addToCurrentBrach( tab );
				this.tree.push( tab );

				return;
			}

			// Prepare the field
			if( 'Repeater' === field.type ) {
				field.children = field.groups.map( group => {
					return React.createElement( RepeaterGroup, {
						...group,
						children: ( new Loader( group.fields ) ).load()
					});
				});
			}

			const preparedField = <Field { ...field } key={ field.name } />;
			this.addToCurrentBrach( preparedField );


			// if ( field.type == 'Tab' ) {
			// 	if( currentTab ) {
			// 		fields.push( React.createElement( Tab, currentTab ) );
			// 	}
			//
			// 	currentTab = Object.assign( {}, field, {
			// 		children: [],
			// 		key: field.name
			// 	});
			//
			// 	return;
			// } else if( field.type === 'Repeater' ) {
			// 	field.children = this.prepareRepeaterGroups( field.groups );
			// }
			//
			// if( currentTab ) {
			// 	currentTab.children.push( <Field {...field} key={ field.name + '' } /> )
			// } else {
			// 	fields.push( <Field {...field} key={ field.name + '' } /> )
			// }
		});
	}
}

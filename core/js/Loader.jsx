import React from 'react';
import Field from './Field.jsx';
import Tab from './Tab.jsx';
import RepeaterGroup from './Container/RepeaterGroup.jsx';
import ConditionalLogic from './ConditionalLogic.jsx';

export default class Loader {
	constructor( source ) {
		this.source = source;
	}

	load() {
		this.fields = [];
		this.generateFields( this.source );
		return this.fields;
	}

	generateFields( source ) {
		source.forEach( field => {
			this.fields.push( this.parseField( field ) );
		});
	}

	wrapFieldInConditionalLogic( children, field ) {
		if( ! field.dependencies || ! field.dependencies.length ) {
			return children;
		}

		const { Group, Rule } = ConditionalLogic;

		return <ConditionalLogic key={ field.name }>
			{ children }

			{ field.dependencies.map( ( group, index ) => <Group key={ index }>
				{ group.map( ( rule, index, ) =>
					<Rule { ...rule } key={ index } />
				) }
			</Group> ) }
		</ConditionalLogic>
	}

	parseField( field ) {
		if( 'Tab' === field.type ) {
			return this.wrapFieldInConditionalLogic(
				React.createElement( Tab, Object.assign( {}, field, {
					children: ( new Loader( field.children ).load() ),
					key:      field.name
				})),
				field
			)
		}

		// Prepare the field
		if( 'Repeater' === field.type ) {
			field.children = field.groups.map( group => {
				return React.createElement( RepeaterGroup, {
					...group,
					key: group.type,
					children: ( new Loader( group.fields ) ).load()
				});
			});
		} else if( 'Complex' === field.type ) {
			field.group.children = ( new Loader( field.group.fields ) ).load();
		}

		return this.wrapFieldInConditionalLogic(
			<Field { ...field } key={ field.name } />,
			field
		);
	}
}

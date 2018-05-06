import React from 'react';
import _ from 'lodash';
import getFieldType from './fields.js';
import ConditionalLogic from './ConditionalLogic.jsx';
import Tab from './Tab.jsx';
import Field from './Field.jsx';
import Container from './Container.jsx';

export default class StoreParser {
	/**
	 * Prepares all contexts, needed for a store based on data and fields.
	 *
	 * @param {Object}         data     A raw multidimentional data array that should be converted.
	 * @param {React.Children} children All children, which might contain fields.
	 * @param {string}         source   A prefix to use for each level.
	 * @return {Object}
	 */
	prepareDataForStore( data, children, source ) {
		const fields = this.constructor.getAllFields( children );
		const stores = {};

		fields.forEach( field => {
			const type = getFieldType( field );

			_.forEach( type.getStores( type, field, data, source ), ( value, key ) => {
				if( key in stores ) {
					stores[ key ] = Object.assign( stores[ key ], value );
				} else {
					stores[ key ] = value;
				}
			});
		});

		return stores;
	}

	extractDataFromState( state, children, source ) {
		const data = {};

		this.constructor.getAllFields( children ).forEach( field => {
			const type = getFieldType( field );
			Object.assign( data, type.getDataFromState( state, type, field, source ) );
		});

		return data;
	}

	/**
	 * Returns all fields, which are direct or indirect children of the container.
	 *
	 * @return <Array.React.Component>
	 */
	static getAllFields( children ) {
		let fields = [];

		React.Children.forEach( children, child => {
			switch( child.type ) {
				case Tab:
				case ConditionalLogic:
					fields = fields.concat( this.getAllFields( child.props.children ) );
					break;

				case Field:
					fields.push( child );
			}
		});

		return fields;
	}
}

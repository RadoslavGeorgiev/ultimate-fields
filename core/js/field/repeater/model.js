import { find, uniqueId, reduce, mergeWith, set, isArray } from 'lodash';

import { loadData } from 'container';
import FieldModel from 'field/model';
import { addRepeaterRow } from './state/actions';

export default class RepeaterFieldModel extends FieldModel {
	/**
	 * Returns an empty value.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return {Array}        An empty array.
	 */
	getEmptyValue( props ) {
		return [];
	}

	/**
	 * Locates the definition of a group based on its type.
	 *
	 * @param {Object} props The definition of a field.
	 * @param {string} type  The type of the group.
	 * @type  {Object}       The Settings of the group.
	 */
	findGroup( props, type ) {
		const { groups } = props;

		return find( groups, { id: type } );
	}
	
	/**
	 * Returns the initial state of the field that will be 
	 * parsed by reducers and added to the store.
	 *
	 * @param  {Object} props   The definition of a field.
	 * @param  {Object} context The initial data that is available.
	 * @return {Object}         An object that will be parsed by the reducers.
	 */
	getInitialState( props, context ) {
		const { name, dataPath } = props;
		
		// Locate the basic value
		let value = context[ name ];
		if ( ( 'undefined' === typeof value ) || null === value ) {
			value = this.getDefaultValue( props );
		}
		
		// Let each group define the rest
		return reduce( value, ( data, row, index ) => {
			const group = this.findGroup( props, row.__type );
			
			const merged = mergeWith(
				data,
				loadData( group.fields, [ ...dataPath, name, index ], row ),
				( target, source ) => {
					if ( isArray( target ) ) {
						return target.concat( source );
					}
				}
			);

			return set( merged, [ 'data', ...dataPath, name, index, '__type' ], row.__type );
		}, {} );
	}

	/**
	 * Maps a dispatcher to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapDispatchToProps() {
		return ( dispatch, { name, dataPath, groups } ) => {
			return {
				addRow: () => dispatch( addRepeaterRow( name, dataPath, groups[ 0 ] ) ),
			};
		}
	}
}

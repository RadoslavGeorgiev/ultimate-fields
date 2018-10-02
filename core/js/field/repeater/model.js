import { find, uniqueId } from 'lodash';

import { loadData } from 'container';
import FieldModel from 'field/field/model';
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
	 * Loads the initial value of the field.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {Array}  value The value that is being loaded.
	 * @return {Array}        A properly loaded list of rows.
	 */
	loadValue( props, value ) {
		return value.map( row => {
			const group = this.findGroup( props, row.__type );

			return loadData( group.fields, {
				__id: uniqueId( 'group-' ),
				...row,
			} );
		} );
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

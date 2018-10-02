import { connect } from 'react-redux';

import { updateValue } from 'state/data/actions';
import { getValue } from 'state/data/selectors';

/**
 * A generic model for all field types.
 *
 * Each field type will have a single model instance, which is
 * why most methods within the class and its children always
 * receive props as their first argument.
 *
 * Consider them as simple functions that can be overloaded
 * for each field type. Those functions will be both selectors
 * and action creators that would otherwise be in separate files.
 */
export default class FieldModel {
	/**
	 * Returns the initial data that should be stored in the store.
	 *
	 * @param  {Object} props   The definition of a field.
	 * @param  {Object} context The initial data that is available.
	 * @return {Object}         An object that can be merged with the data of other fields.
	 */
	getInitialData( props, context ) {
		const { name } = props;

		// Start with the value from the context.
		let value = context[ name ];

		// If there is no value, load a default one.
		if ( ( 'undefined' === typeof value ) || null === value ) {
			value = this.getDefaultValue( props );
		}

		// Formats the value correctly (ex `3` becoming `"3"` for text fields).
		value = this.loadValue( props, value );

		return {
			[ name ]: value,
		};
	}

	/**
	 * Loads the default value of a field.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return                A default value.
	 */
	getDefaultValue( props ) {
		const { default_value } = props;

		return ( 'undefined' === typeof default_value )
			? this.getEmptyValue( props )
			: default_value;
	}

	/**
	 * Returns a default value if one is not present in the props.
	 *
	 * @param  {Object} props The definition of a field.
	 * @return {string}       An empty string, suitable for most field types.
	 */
	getEmptyValue( props ) {
		return '';
	}

	/**
	 * Converts a value to the proper type when it is being loaded.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {*}      value The value that is being loaded.
	 * @return {*}
	 */
	loadValue( props, value ) {
		return value;
	}

	/**
	 * Extracts the value of the field from the state.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {Object} state The whole Redux state.
	 * @return {Object}       An object that should be merged with other extractions.
	 */
	extractDataFromState( props, state ) {
		const { name } = props;

		return {
			[ name ]: this.getValueFromState( props, state )
		};
	}

	/**
	 * Creates a connected component.
	 *
	 * Will be used for both field elements and inputs.
	 *
	 * @param  {React.Component} Component A component class.
	 * @return {React.Component}           The wrapped component.
	 */
	connect( Component ) {
		return connect(
			this.mapStateToProps(),
			this.mapDispatchToProps()
		)( Component );
	}

	/**
	 * Maps the global state to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapStateToProps() {
		return ( state, props ) => ( {
			value: this.getValueFromState( props, state ),
		} );
	}

	/**
	 * Maps a dispatcher to the props of a wrapped component.
	 *
	 * @return {function} A function to be called when mapping.
	 */
	mapDispatchToProps() {
		return ( dispatch, props ) => ( {
			onChange: value => dispatch( this.updateValue( props, value ) ),
		} )
	}

	/**
	 * Extracts the value of a field from the state.
	 *
	 * @param  {Object} props A field definition.
	 * @param  {Object} state The global Redux state.
	 * @return {*}            The value of the field.
	 */
	getValueFromState( props, state ) {
		const { name, dataPath } = props;

		return getValue( state, [ ...dataPath, name ] );
	}

	/**
	 * Creates a new action that updates the value of a field.
	 *
	 * @param  {Object} props The definition of a field.
	 * @param  {*}      value The new value.
	 * @return {Object}       A Redux action.
	 */
	updateValue( props, value ) {
		const { name, dataPath } = props;

		return updateValue( [ ...dataPath, name ], value );
	}
}

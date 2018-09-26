import { connect } from 'react-redux';

import { updateValue } from '../../state/datastores/actions';
import { getValue } from '../../state/datastores/selectors';

export default class FieldModel {
	constructor( field ) {
		this.props = field;
	}

	getInitialData( context ) {
		const { name } = this.props;

		const value = context.hasOwnProperty( name )
			? context[ name ]
			: this.getDefaultValue();

		return {
			[ name ]: this.importValue( value ),
		};
	}

	getDefaultValue() {
		const { default_value } = this.props;

		return ( 'undefined' != typeof default_value )
			? default_value
			: this.getEmptyValue();
	}

	getEmptyValue() {
		return '';
	}

	importValue( value ) {
		return value;
	}

	connect( Component ) {
		return connect(
			this.mapStateToProps(),
			this.mapDispatchToProps()
		)( Component );
	}

	mapStateToProps() {
		return state => ( {
			value: this.getValueFromState( state ),
			visible: this.isVisible( state ),
		} );
	}

	mapDispatchToProps() {
		return dispatch => ( {
			onChange: value => dispatch( this.updateValue( value ) ),
		} )
	}

	getValueFromState( state ) {
		const { name, datastore } = this.props;

		return getValue( state, [ ...datastore, name ] );
	}

	updateValue( value ) {
		const { name, datastore } = this.props;

		return updateValue( [ ...datastore, name ], value );
	}

	extractDataFromState( state ) {
		const { name } = this.props;

		return {
			[ name ]: this.getValueFromState( state )
		};
	}

	isVisible( state ) {
		const { datastore, dependencies } = this.props;

		if ( ! dependencies ) {
			return true;
		}

		return getValue( state, [ ...datastore, dependencies[ 0 ][ 0 ].field ] ) === dependencies[ 0 ][ 0 ].value;
	}
}

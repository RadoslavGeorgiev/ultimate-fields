import React from 'react';
import Select from './Select.jsx';
import { map } from 'lodash';

export default class Multiselect extends Select {
	/**
	 * Prepares the options for the input and renders it according
	 *
	 * @return {React.Component} A component with the fields' input.
	 */
	renderInput() {
		const { name, input_type } = this.props;

		return 'checkbox' === input_type
			? this.renderCheckboxes( this.getOptions() )
			: this.renderMultiselect( this.getOptions() );
	}

	/**
	 * Renders a dropdown (select) with options.
	 *
	 * @param  {Object} options  An object with all available options.
	 * @return {React.Component} A select field.
	 */
	renderMultiselect( options ) {
		const children = map( options, ( label, key ) =>
			<option key={ key } value={ key }>{ label }</option>
		);

		return React.createElement( 'select', {
			id:        this.id,
			value:     this.getValue(),
			children:  children,
			className: 'field__input field__input--select',
			ref:       'input',
			multiple:  true,
			onChange:  () => {} // Shut React up
		});
	}

	/**
	 * Once the component has been mounted in multiselect mode,
	 * this will start select2 in order to display a nice-looking field.
	 */
	componentDidMount() {
		const { input } = this.refs;
		const { name, input_type, onValueChanged } = this.props;

		if( 'checkbox' === input_type ) {
			return;
		}

		jQuery( input ).select2({
			width: '100%'
		}).on( 'change', function() {
			onValueChanged( name, jQuery( input ).val() );
		});
	}

	/**
	 * Renders a list with radio buttons.
	 *
	 * @param  {Object} options  An object with all available options.
	 * @return {React.Component} A select field.
	 */
	renderCheckboxes( options ) {
		const { orientation } = this.props;

		return <ul className={ 'uf-radio uf-radio--' + orientation }>
			{ map( options, ( label, key ) => {
				const checked = -1 !== this.getValue().indexOf( key );

				return <li key={ key }>
					<label>
						<input type="checkbox" value={ key } checked={ checked } onChange={ this.checkboxChanged.bind( this ) } />
						<span dangerouslySetInnerHTML={{ __html: label }} />
					</label>
				</li>
			})}
		</ul>
	}

	/**
	 * Once a checkbox has been changed, its value will either be removed or added.
	 *
	 * @param {Event} e The event that just happened.
	 */
	checkboxChanged( e ) {
		const { name, onValueChanged } = this.props;
		const current = ( this.getValue() || [] );

		if( e.target.checked ) {
			onValueChanged( name, current.concat( [ e.target.value ] ) )
		} else {
			onValueChanged( name, current.filter( value => value !== e.target.value ) )
		}
	}

	/**
	 * Returns the default value for the field.
	 *
	 * @return {Array}
	 */
	static getDefaultValue() {
		return [];
	}

	/**
	 * The value of the field will be turned into a proper array.
	 *
	 * @param  {mixed}         value The value to be prepared.
	 * @param  {React.Element} field The field whose value is being prepared.
	 * @return {Array}
	 */
	static prepareValue( value, field ) {
		if( 'object' == typeof value ) {
			return value;
		} else {
			return field.props.default_value || []
		}
	}

	/**
	 * Returns avalidator, that will check the value of the field.
	 *
	 * @return {Function}
	 */
	static getValidator() {
		return ( store, field, source ) => {
			const { name, label, required } = field.props;

			if( ! required ) {
				return [];
			}

			let message;
			const state   = store.getState();
			const context = state.values[ source ];
			const value   = context ? context[ name ] : [];

			if( ! value.length ) {
				message = label + ' does not contain a valid value.';
			}

			store.dispatch({
				type: 'SET_VALIDATION_MESSAGE',
				name: source + '_' + name,
				message
			});

			return message ? [ message ] : [];
		}
	}
}

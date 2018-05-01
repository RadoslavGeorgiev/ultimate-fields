import React from 'react';
import Field from './../Field.jsx';
import { map } from 'lodash';

export default class Select extends Field {
	/**
	 * Prepares the options for the input and renders it according
	 *
	 * @return {React.Component} A component with the fields' input.
	 */
	renderInput() {
		const { name, input_type } = this.props;

		return 'radio' === input_type
			? this.renderRadios( this.getOptions() )
			: this.renderDropdown( this.getOptions() );
	}

	/**
	 * Renders a dropdown (select) with options.
	 *
	 * @param  {Object} options  An object with all available options.
	 * @return {React.Component} A select field.
	 */
	renderDropdown( options ) {
		const children = map( ( label, key ) =>
			<option key={ key } value={ key }>{ label }</option>
		);

		return <select
			id={ this.id }
			value={ this.getValue() }
			children={ children }
			onChange={ e => onValueChanged( name, e.target.value ) }
			className="field__input field__input--select"
			ref="input"
		/>
	}

	/**
	 * Renders a list with radio buttons.
	 *
	 * @param  {Object} options  An object with all available options.
	 * @return {React.Component} A select field.
	 */
	renderRadios( options ) {
		const { orientation } = this.props;

		return <ul className={ 'uf-radio uf-radio--' + orientation }>
			{ map( options, ( label, key ) => {
				const checked = this.getValue() === key;

				return <li key={ key }>
					<label>
						<input type="radio" name={ this.id } value={ key } checked={ checked } onChange={ this.radioChanged.bind( this ) } />
						<span dangerouslySetInnerHTML={{ __html: label }} />
					</label>
				</li>
			})}
		</ul>
	}

	radioChanged( e ) {
		const { name, onValueChanged } = this.props;

		onValueChanged( name, e.target.value );
	}

	static getOptions( props ) {
		let { options } = props;

		if( ! options ) {
			options = {}

			React.Children.forEach( this.props.children, child => {
				options[ child.props.key ] = child.props.children;
			});
		}

		return options;
	}

	getOptions() {
		return Select.getOptions( this.props );
	}

	static getDefaultValue( props ) {
		let value = null;

		map( Select.getOptions( props ), ( label, key ) => {
			if( null === value ) {
				value = key;
			}
		});

		return value;
	}

	componentDidMount() {
		const { input } = this.refs;
		const { input_type, use_select2 } = this.props;

		if( 'select' == input_type && use_select2 ) {
			jQuery( input ).select2();
		}
	}
}

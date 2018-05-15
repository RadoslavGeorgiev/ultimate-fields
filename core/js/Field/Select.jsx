import React from 'react';
import Field from './../Field.jsx';
import _ from 'lodash';

export default class Select extends Field {
	/**
	 * Prepares the options for the input and renders it according
	 *
	 * @return {React.Component} A component with the fields' input.
	 */
	renderInput() {
		const { input_type } = this.props;
		const options = this.getOptions();
		const basic = this.constructor.getBasicOptions( options );

		if( _.isEmpty( basic ) ) {
			return <p>This field has no options.</p>
		}

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
		const { name, onValueChanged } = this.props;

		const children = _.map( options, ( label, key ) =>
			'object' === typeof label
				? this.renderGroup( key, label )
				: this.renderOption( key, label )
		);

		return React.createElement( 'select', {
			id:        this.id,
			value:     this.getValue(),
			children:  children,
			className: 'field__input field__input--select',
			ref:       'input',
			onChange:  e => onValueChanged( name, e.target.value )
		});
	}

	renderOption( key, label ) {
		return <option key={ key } value={ key }>{ label }</option>
	}

	renderGroup( label, options ) {
		return <optgroup label={ label } key={label}>
			{ _.map( options, ( label, key ) => this.renderOption( key, label ) ) }
		</optgroup>
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
			{ _.map( options, ( label, key ) => {
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
		return this.constructor.getOptions( this.props );
	}

	static getBasicOptions( options ) {
		const basic = [];

		_.forEach( options, ( label, key ) => {
			if( 'object' === typeof label ) {
				_.forEach( label, ( sublabel, key ) => {
					basic.push( key );
				});
			} else {
				basic.push( key );
			}
		});

		return basic;
	}

	static prepareValue( value, field ) {
		const options = Select.getOptions( field.props, true );
		const basic = Select.getBasicOptions( options );

		if( -1 != basic.indexOf( value ) ) {
			return value;
		}

		value = null;
		_.map( basic, key => {
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

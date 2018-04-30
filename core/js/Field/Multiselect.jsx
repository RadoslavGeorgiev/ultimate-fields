import React from 'react';
import Select from './Select.jsx';
import { map } from 'lodash';

export default class Multiselect extends Select {
	getDefaultValue() {
		return [];
	}

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

	checkboxChanged( e ) {
		const { name, onValueChanged } = this.props;
		const current = ( this.getValue() || [] );

		if( e.target.checked ) {
			onValueChanged( name, current.concat( [ e.target.value ] ) )
		} else {
			onValueChanged( name, current.filter( value => value !== e.target.value ) )
		}
	}
}

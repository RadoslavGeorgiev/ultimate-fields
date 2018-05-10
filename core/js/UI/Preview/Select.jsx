import React from 'react';
import request from './../../PHP/request.js';
import Preview from './../Preview.jsx';
import SelectField from './../../Field/Select.jsx';

export default class Select extends Preview {
	state = {
		optionsLoaded: false
	}

	renderPreview() {
		const { select_input_type, select_orientation, select_type, use_select2 } = this.props.field;

		const options = this.state.optionsLoaded
		 	? this.state.optionsLoaded
			: Select.loadOptions( this.props.field );

		if( options instanceof Promise ) {
			options.then( options => {
				this.setState({
					optionsLoaded: options
				});
			});

			return <p className="uf-preview-loader">
				<span className="spinner is-active uf-preview-loader__icon" />
				<span className="uf-preview-loader__text">Loading...</span>
			</p>;
		}

		return React.createElement( SelectField, {
			...this.getPreviewArgs(),

			options:     options,
			input_type:  select_input_type,
			orientation: select_orientation,
			use_select2: ( 'dropdown' == select_type ) && use_select2
		});
	}

	/**
	 * Extracts manual options from a fields' data.
	 */
	static extractOptions( raw ) {
		var options = {};

		// Parse options
		_.each( ( raw || '' ).split( "\n" ), function( option ) {
			var parts;

			if( '' === option ) {
				return;
			}

			option = option.trim();

			if( -1 == option.indexOf( '::' ) ) {
				options[ option ] = option;
			} else {
				parts = option.split( '::' );
				options[ parts[ 0 ].trim() ] = parts[ 1 ].trim();
			}
		});

		return options;
	}

	/**
	 * Adds options to a field based on it's settings.
	 */
	static loadOptions( field ) {
		const { select_options_type, select_options, select_post_type } = field;

		if( 'posts' != select_options_type ) {
			return Select.extractOptions( select_options );
		}

		return request({
			body: {
				uf_ajax:   true,
				uf_action: 'select_ui_options',
				post_type: select_post_type
			}
		});
	}

	/**
	 * Returns the available comparators for conditional logic.
	 */
	static getComparators() {
		return [
			{
				compare: '=',
				label:   'equals',
				operand: true
			},
			{
				compare: '!=',
				label:   'is not equal to',
				operand: true
			}
		];
	}

	/**
	 * Creates a view for the operand.
	 */
	static getOperand( field ) {
		const options = Select.loadOptions( field );

		if( options instanceof Promise ) {
			return <GeneratedSelect promised={ options } useWrapper={ false } />
		} else {
			return <SelectField options={ options } />;
		}

	}
}

class GeneratedSelect extends React.Component {
	state = {
		generated: false
	}

	componentDidMount() {
		this.props.promised.then( options => {
			this.setState({ generated: options });
		});
	}

	render() {
		const { generated } = this.state;

		return generated
			? <SelectField { ...this.props } options={ generated } />
			: <p>Loading...</p>
	}
}

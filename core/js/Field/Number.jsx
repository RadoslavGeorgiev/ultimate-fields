import React from 'react';
import Text from './Text.jsx';

export default class Number extends Text {
	renderInput() {
		const {
			name, value,
			minimum, maximum, slider_enabled: slider, step,
			onValueChanged
		} = this.props;

		const props = {
			id:        this.id,
			ref:       'input',
			type:      "number",
			value:     this.getValue() || 0,
			className: "uf-field__input uf-field__input--text",
			onChange:  e => onValueChanged( name, e.target.value )
		}

		// Add the minimum and maximum
		if( false !== minimum ) { props.min = minimum; }
		if( false !== maximum ) { props.max = maximum; }
		if( false !== step )    { props.step = step; }

		// Check for sliders
		if( slider ) {
			// Hide the base input
			props.className += ' uf-number__indicator';

			// Add the slider and the indicator after the input, then hide it
			return [
				<input {...props} key="input" />,
				<div className="uf-number" ref={ el => this.initializeSlider( el ) } key="slider" />
			]
		} else {
			return this.wrapInput( <input {...props} /> )
		}
	}

	initializeSlider( element ) {
		const $slider = this.$slider = jQuery( element );
		const { name, minimum: min, maximum: max, step, onValueChanged } = this.props;

		$slider.slider({
			min,
			max,
			step,
			value:   this.getValue(),
			range:   'min',
			animate: 'fast',
			slide:   function( event, ui ) {
				onValueChanged( name, ui.value );
			}
		});

		$slider.find( '.ui-slider-handle' ).addClass( 'wp-ui-highlight' );
	}

	componentDidUpdate() {
		if( this.$slider ) {
			this.$slider.slider( 'value', this.getValue() );
		}
	}

	static getDefaultValue( field ) {
		const { minimum, default_value } = field.props;

		return default_value
			|| minimum
			|| 0;
	}

	static prepareValue( value, field ) {
		const parsed = parseFloat( value );

		return isNaN( parsed )
			? 0
			: parsed;
	}

	componentDidMount() {
		// No autocomplete for passwords
	}
}

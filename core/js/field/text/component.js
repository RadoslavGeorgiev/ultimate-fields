/**
 * Extenral dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class TextField extends React.Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		prefix: PropTypes.string,
		suffix: PropTypes.string,
		suggestions: PropTypes.arrayOf( PropTypes.string ),
	}

	/**
	 * Renders the input of the text field.
	 *
	 * @param  {Object}        props          The props for the input.
	 * @param  {string}        props.value    The value of the input.
	 * @param  {string}        props.prefix   An optional prefix.
	 * @param  {string}        props.suffix   An optional suffix.
	 * @param  {Function}      props.onChange The callback to use on change.
	 * @return {React.Element}
	 */
	render() {
		const { value, prefix, suffix, onChange } = this.props;

		return <div className="uf-basic-input">
			{ prefix && <span className="uf-field__prefix">{ prefix }</span> }
			<input
				type="text"
				value={ value }
				ref="input"
				onChange={ ( { target: { value } } ) => onChange( value ) }
			/>
			{ suffix && <span className="uf-field__suffix">{ suffix }</span> }
		</div>
	}

	/**
	 * Starts autocomplete when the component has been mounted.
	 */
	componentDidMount() {
		const { suggestions } = this.props;
		const { input } = this.refs;

		if ( ! suggestions || ! suggestions.length ) {
			return;
		}

		jQuery( input ).autocomplete( {
			source: suggestions
		} );
	}
}

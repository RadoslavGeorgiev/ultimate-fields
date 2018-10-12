/**
 * External dependencies
 */
import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import layoutProps, { defaultLayutProps } from 'container/layout-props';

/**
 * Handles the wrapper of every field, including label, description and etc.
 */
export default class Element extends Component {
	static propTypes = {
		// Server-side
		...layoutProps,
		label: PropTypes.string.isRequired,
		hide_label: PropTypes.bool,
		description: PropTypes.string,
		required: PropTypes.bool,
		validation_message: PropTypes.string,
		field_width: PropTypes.number,
		classNames: PropTypes.arrayOf( PropTypes.string ),

		// Model props
		visible: PropTypes.bool,

		// A bool true/false or a custom validation message
		invalid: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.string ] ),
	}

	static defaultProps = {
		// Server-side
		...defaultLayutProps,
		hide_label: false,
		required: false,
		description: '',
		validation_message: '',
		field_width: 100,

		// Model props
		visible: true,
		invalid: false,
		classNames: [],
	}

	state = {
		validationVisible: false,
	}

	render() {
		const {
			label, hide_label, required, children,
			visible, field_width, classNames,
		} = this.props;

		// A shortcut to the elementClass method
		const el = this.elementClass.bind( this );

		// Prepare the root classes
		const className = el( null, hide_label && 'no-label' )
			+ classNames.map( name => ' ' + name ).join( '' );

		// Prepare styles
		const styles = {};
		if ( 100 !== field_width ) {
			styles.width = field_width + '%';
		}

		// Use a generic skeleton
		return <div className={ className } style={ styles }>
			{ ( ! hide_label ) && <div className={ el( 'details' ) }>
				<label className={ el( 'label' ) }>
					{ label }
					{ required && <span className="uf-field__star">*</span> }
				</label>
				{ this.renderDescription( 'label' ) }
			</div> }

			<div className={ el( 'input', hide_label && 'no-label' ) }>
				{ children }
				{ this.renderDescription( 'input' ) }
				{ this.renderValidationMessage() }
			</div>
		</div>
	}

	/**
	 * Adds all generic modifiers and generates a class name.
	 *
	 * @param  {string} [element=''] The name of the element.
	 * @param  {string} modifiers    All following arguments will be considered modifiers.
	 * @return {string}              A complete CSS class.
	 */
	elementClass( element = '', ...modifiers ) {
		const { layout, style } = this.props;

		element = element ? '__' + element : '';

		return classNames(
			[
				`uf-field${element}`,
			].concat( modifiers.filter( modifier => !! modifier ).map(
				modifier => `uf-field${element}--${modifier}`
			) ).concat( [
				style,
				layout,
			] )
		);
	}

	/**
	 * Renders the description given a specific position.
	 *
	 * @param {string} slot The slot where the description would be rendered.
	 * @return {Object|null}
	 */
	renderDescription( slot ) {
		const { description, description_position } = this.props;

		if ( ! description || ! description.length || slot !== description_position ) {
			return null;
		}

		return createElement( 'div', {
			className: this.elementClass( 'description', slot ),
			dangerouslySetInnerHTML: {
				__html: description,
			},
		} );
	}

	/**
	 * Renders the validation message when needed.
	 *
	 * @return {Object|null}
	 */
	renderValidationMessage() {
		const { validation_message, invalid } = this.props;
		const { validationVisible } = this.state;

		if ( ! invalid ) {
			return null;
		}

		const message = ( 'string' === typeof invalid )
			? invalid
			: validation_message;

		return createElement( 'div', {
			dangerouslySetInnerHTML: {
				__html: message,
			},
			className: classNames( [
				'uf-field__validation-message',
				validationVisible && 'uf-field__validation-message--visible',
			] ),
		} );
	}

	/**
	 * Checks whether the validation message should be animated into visibility.
	 */
	showValidationMessage() {
		const { invalid } = this.props;
		const { validationVisible } = this.state;

		if ( invalid && ! validationVisible ) {
			return setTimeout( () => {
				this.setState( {
					validationVisible: true,
				} );
			}, 0 );
		}
	}

	/**
	 * When the component has been mounted, the validation message might be shown.
	 */
	componentDidMount() {
		this.showValidationMessage();
	}

	/**
	 * When the component has been updated, the validation message might be shown.
	 */
	componentDidUpdate( prevProps, prevState ) {
		const { invalid } = this.props;
		const { validationVisible } = this.state;

		if ( ! invalid && validationVisible ) {
			return this.setState( {
				validationVisible: false,
			} );
		}

		this.showValidationMessage();
	}
}

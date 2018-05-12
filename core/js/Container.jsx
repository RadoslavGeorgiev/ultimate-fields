import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { updateValue, cacheValue, fieldBlurred } from './actions.js';
import getFieldType from './fields.js';
import ConditionalLogic from './ConditionalLogic.jsx';
import Tab from './Tab.jsx';
import ConditionalTabWrapper from './ConditionalTabWrapper.jsx';
import TabButton from './TabButton.jsx';
import Grid from './Grid.js';

var cache = {};

const mapStateToProps = ( { values: state, validation }, ownProps ) => ({
	// Locate the values for the current source
	values:         state[ ownProps.source || '__' ],

	// Locate the validation state of the current context
	validation:     validation[ ownProps.source || '__' ],

	// Returns the value of a field from a given context
	getFieldValue:  ( context, name ) => state[ context ][ name ],

	// Returns a whole context
	getContext:     ( context )       => state[ context ],

	// Returns a cached value
	getCachedValue: ( name )          => cache[ name ]
});

const mapDispatchToProps = dispatch => ({
	// Handles generic value changes
	onChange: ( name, value, context ) => dispatch( updateValue( name, value, context ) ),

	// Allows values to be cached globally
	// cacheValue: ( name, value )        => dispatch( cacheValue( name, value ) )
	cacheValue: ( name, value )        => cache[ name ] = value,

	// Indicates that a field has been blurred
	onBlur: ( name, context ) => dispatch( fieldBlurred( name, context ) )
});

/**
 * Containers are objects, which contain fields, as well as conditional logic, tabs and etc.
 * They are used within top-level forms, as well as within repeaters, popups and etc.
 */
class Container extends React.Component {
	static defaultProps = {
		layout: 'grid',
		description_position: 'input',
		display_tabs: true,
		display_tabs_wrapper: false
	}

	/**
	 * Renders the basic list of fields.
	 *
	 * @return {React.Component} A fields DIV.
	 */
	render() {
		const { children, layout, display_tabs, display_tabs_wrapper, className } = this.props;

		const tabs = this.getTabButtons();

		const cssClasses = [
			'uf-fields',
			'uf-fields--' + layout,
			className
		].filter( className => !! className ).join( ' ' ); // Remove empty classes

		if( display_tabs_wrapper && display_tabs && tabs ) {

			// A special structure for overlays
			return <div className="uf-fields-and-tabs">
				{ tabs }
				<div className={ cssClasses } ref="fields">{
					React.Children.map( children, this.prepareField.bind( this ) )
				}</div>
			</div>

		} else {

			// Generic tabs within fields
			return <div className={ cssClasses } ref="fields">
				{ tabs ? tabs : null }
				{ React.Children.map( children, this.prepareField.bind( this ) ) }
			</div>

		}
	}

	/**
	 * Returns universal properties, used for conditional logic
	 *
	 * @return {Object}
	 */
	getConditionalLogicProps() {
		const { source, getFieldValue } = this.props;

		return {
			prepareField:  this.prepareField.bind( this ),
			source,
			getFieldValue
		};
	}

	/**
	 * Converts a basic element into a real field, conditional logic or tabs.
	 *
	 * @param  {React.Component} field A component, which belongs in a container.
	 * @return {React.Component}
	 */
	prepareField( field ) {
		const {
			values, source, layout, description_position,
			onChange, onBlur, getContext, getCachedValue, cacheValue
		} = this.props;

		const { name, type } = field.props;

		// Get some additional props for the conditional logic and let it do the job.
		if( field.type === ConditionalLogic ) {
			return React.cloneElement( field, this.getConditionalLogicProps() );
		}

		// Add some additional params to tabs and let them do the rest.
		if( field.type === Tab ) {
			return React.cloneElement( field, {
				prepareField: this.prepareField.bind( this ),
				source:       source,
				active:       this.currentTab === field.props.id
			});
		}

		// Prepare all standardized props
		const props = Object.assign( {}, field.props, {
			value:                ( values && ( name in values ) ) ? values[ name ]: null,
			onValueChanged:       ( name, value ) => onChange( name, value, source ),
			onBlur:               name => onBlur( name, source ),

			source, getContext, description_position, layout, getCachedValue, cacheValue
		});

		// Determine the field class
		const fieldClass = getFieldType( field );

		// Create and return the element
		return React.createElement( fieldClass, props );
	}

	/**
	 * Generates a div with all tabs.
	 *
	 * @return {React.Component}
	 */
	getTabButtons() {
		const { children, values, layout, className, source, onChange } = this.props;
		const tabs = [];

		// Extract all tabs
		React.Children.forEach( children, child => {
			if( Tab === child.type ) {
				tabs.push({ tab: child.props });
			} else if( ConditionalLogic === child.type ) {
				React.Children.forEach( child.props.children, subChild => {
					if( subChild.type === Tab ) tabs.push({
						tab: subChild.props,
						logic: child
					});
				});
			}
		});

		// Do not generate anything if there are no tabs
		if( ! tabs.length ) {
			return null;
		}

		// Determine the current tab
		this.currentTab = values.__tab
			? values.__tab
			: tabs[0].tab.id;

		// Prepare all needed CSS classes
		const cssClass = [
			'uf-tabs',
			'uf-tabs--' + layout,
			( className && -1 !== className.indexOf( 'boxed' ) ) ? 'uf-tabs--boxed' : null
		].filter( cssClass => !! cssClass ).join( ' ' );

		// Generate the wrapper
		return <div className={ cssClass }>{
			tabs.map( ( tab, i ) => {
				const el = React.createElement( TabButton, {
					...tab.tab,
					key:     i,
					active:  this.currentTab === tab.tab.id,
					onClick: () => onChange( '__tab', tab.tab.id, source )
				});

				return ! tab.logic
					? el
					: React.createElement( ConditionalTabWrapper, {
						...this.getConditionalLogicProps(),
						logicProps: tab.logic.props,
						key: i,
						children: el,
					});
			})
		}</div>
	}

	componentDidMount() {
		const { layout } = this.props;

		if( 'grid' === layout ) {
			this.grid = new Grid( this.refs.fields );
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if( this.grid ) {
			this.grid.resize();
		}
	}
}

// @todo: Definitely change this
const connected = connect( mapStateToProps, mapDispatchToProps )( Container );
connected.cache = cache;
export default connected;

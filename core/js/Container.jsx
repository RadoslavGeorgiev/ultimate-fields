import React from 'react';
import { connect } from 'react-redux';
import { updateValue, cacheValue } from './actions.js';
import getFieldType from './fields.js';

import ConditionalLogic from './ConditionalLogic.jsx';
import Tab from './Tab.jsx';
import ConditionalTabWrapper from './ConditionalTabWrapper.jsx';
import TabButton from './TabButton.jsx';

const mapStateToProps = ( { values: state, cache, validation }, ownProps ) => ({
	values:         state[ ownProps.source || '__' ],
	validation:     validation[ ownProps.source || '__' ],
	getFieldValue:  ( context, name ) => state[ context ][ name ],
	getContext:     ( context )       => state[ context ],
	getCachedValue: ( name )          => cache[ name ]
});

const mapDispatchToProps = dispatch => ({
	onChange: ( name, value, context ) => dispatch( updateValue( name, value, context ) ),
	cacheValue: ( name, value )        => dispatch( cacheValue( name, value ) )
});

class Container extends React.Component {
	static defaultProps = {
		layout: 'grid',
		description_position: 'input'
	}

	render() {
		const { children, layout, className } = this.props;

		const cssClasses = [
			'uf-fields',
			'uf-fields--' + layout,
			className
		].filter( className => !! className ).join( ' ' ); // Remove empty classes

		return (
			<div className={ cssClasses }>
				{ this.getTabButtons() }
				{ React.Children.map( children, this.prepareField.bind( this ) ) }
			</div>
		);
	}

	getConditionalLogicProps() {
		const { source, getFieldValue } = this.props;

		return {
			prepareField:  this.prepareField.bind( this ),
			source,
			getFieldValue
		};
	}

	prepareField( field ) {
		if( ! field ) {
			return null;
		}

		const { values, source, layout, description_position, onChange, getContext, getCachedValue, cacheValue } = this.props;
		const { name, type } = field.props;

		// Handle conditional logic differently
		if( field.type === ConditionalLogic ) {
			return React.cloneElement( field, this.getConditionalLogicProps() );
		}

		// Handle tabs differently
		if( field.type === Tab ) {
			return React.cloneElement( field, {
				prepareField: this.prepareField.bind( this ),
				source:       source,
				active:       this.currentTab === field.props.id
			});
		}

		// Prepare standardized properties
		const props = Object.assign( {}, field.props, {
			source:               source,
			value:                ( values && ( name in values ) ) ? values[ name ]: null,
			getContext:           getContext,
			onValueChanged:       ( name, value ) => onChange( name, value, source ),
			description_position,
			layout,
			getCachedValue,
			cacheValue
		});

		// Determine the field class
		const fieldClass = getFieldType( field );

		// Create and return the element
		return React.createElement( fieldClass, props );
	}

	getTabButtons() {
		const { children, values, source, onChange } = this.props;
		const tabs = [];

		const prepareTab = ( tab, logic ) => {
			tabs.push({ tab, logic });
		}

		React.Children.map( children, child => {
			if( child.type == Tab ) {
				prepareTab( child.props );
			}

			if( child.type === ConditionalLogic ) {
				React.Children.map( child.props.children, subChild => {
					if( subChild.type === Tab ) {
						prepareTab( subChild.props, child );
					}
				})
			}
		});

		if( ! tabs.length ) {
			return null;
		}

		// Determine the current tab
		this.currentTab = values.__tab
			? values.__tab
			: tabs[0].tab.id;

		return <div className="uf-tabs">{
			tabs.map( ( tab, i ) => {
				const el = React.createElement( TabButton, {
					...tab.tab,
					key:     i,
					active:  this.currentTab === tab.tab.id,
					onClick: () => onChange( '__tab', tab.tab.id, source )
				});

				if( ! tab.logic ) {
					return el;
				}

				return React.createElement( ConditionalTabWrapper, {
					...this.getConditionalLogicProps(),
					logicProps: tab.logic.props,
					key: i,
					children: el,
				});
			})
		}</div>
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( Container );

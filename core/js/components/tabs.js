/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forEach } from 'lodash';

/**
 * Internal dependencies
 */
import Tab from 'components/tab';
import { getValidationMessage } from 'state/validation/selectors';

class Tabs extends Component {
	render() {
		const { tabs, style, layout, container, dataPath } = this.props;

		return (
			<div className={ `uf-tabs uf-tabs--${style} uf-tabs--${layout}` }>
				{ tabs.map( tab => {
					return <Tab
						key={ tab.name }
						container={ container }
						dataPath={ dataPath }
						style={ style }
						{ ...tab }
					/>;
				} ) }
			</div>
		);
	}
}

/**
 * Prepares the tabs for a container.
 *
 * @param  {Object} state               The global Redux state.
 * @param  {Object} props               The props for the fields.
 * @param  {Array}  props.containerPath The path to the container's state.
 * @param  {Array}  props.fields        The fields of the container.
 * @return {Object}                     Additional props for the component.
 */
export const mapStateToProps = ( state, props ) => {
	const { containerPath, rawFields } = props;

	const tabs = [];

	// Extract the tabs from the list of fields
	forEach( rawFields, definition => {
		const { name } = definition;

		// Validate the field for the tab
		if ( 'tab' !== definition.type ) {
			if ( ! definition.tab )  {
				return;
			}

			const message = getValidationMessage( state, {
				containerPath,
				name
			} );

			if ( message ) {
				tabs.find( tab => tab.name === definition.tab ).invalid = true;
			}

			return;
		}

		// Add to the list of tabs (but clone for dependencies)
		tabs.push( {
			...definition
		} );
	} );

	return {
		tabs,
	};
}

export default connect(
	mapStateToProps,
	null
)( Tabs );

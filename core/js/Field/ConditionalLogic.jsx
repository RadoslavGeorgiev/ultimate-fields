import React from 'react';
import Field from './../Field.jsx';
import Button from './../Button.jsx';
import Group from './ConditionalLogic/Group.jsx';
import Rule from './ConditionalLogic/Rule.jsx';

// @todo: Move to the UI

export default class ConditionalLogic extends Field {
	renderInput() {
		const value = this.getValue();

		Rule.clearCache();

		if( ! Rule.getSelectors().length ) {
			return <p>There are no fields, which can be used for conditional logic right now.</p>
		}

		return <div className="uf-logic">
			{ value.length
				? <div className="uf-logic__groups">
					{ value.map( ( group, i ) => this.renderGroup( group, i ) ) }
				</div>
				: <div className="uf-logic__message">
					<p>Conditional logic will allow the field to show up only when a set of requirements are met. You can add groups of rules for this. The relation between the rules within a group is &quot;AND&quot; and between each group - &quot;OR&quot;.</p>
				</div>
			}

			<Button icon="dashicons-plus" className="uf-logic__add-group" onClick={ this.addGroup.bind( this ) }>Add group</Button>
		</div>
	}

	renderGroup( group, i ) {
		const { rules } = group;

		return React.createElement( Group, {
			rules,
			key: i,
			onUpdate: updated => this.updateGroup( group, updated ),
			onDelete: () => this.removeGroup( group )
		});
	}

	/**
	 * The value of the field will be turned into a proper array.
	 *
	 * @param  {mixed}         value The value to be prepared.
	 * @param  {React.Element} field The field whose value is being prepared.
	 * @return {Array}
	 */
	static prepareValue( value, field ) {
		if( 'object' == typeof value ) {
			return value;
		} else {
			return []
		}
	}

	addGroup() {
		const group = {
			rules: [ Rule.getDefaultRule() ]
		}

		this.updateValue( this.getValue().concat( [ group ] ) );
	}

	updateGroup( group, updated ) {
		const newValue = this.getValue().map( existing => {
			return existing === group ? updated : existing
		});

		this.updateValue( newValue );
	}

	removeGroup( group ) {
		this.updateValue( this.getValue().filter( existing => existing !== group ) );
	}
}

import React from 'react';
import Field from './../Field.jsx';
import Button from './../Button.jsx';
import Group from './ConditionalLogic/Group.jsx';

// @todo: Move to the UI

export default class ConditionalLogic extends Field {
	renderInput() {
		const value = this.getValue();

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
		return React.createElement( Group, {
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
		this.updateValue( this.getValue().concat( [ [] ] ) );
	}

	updateGroup( group, updated ) {
		this.updateValue( this.getValue().map( existing => {
			return existing === group ? updated : existing
		}));
	}

	removeGroup( group ) {
		this.updateValue( this.getValue().filter( existing => existing !== group ) );
	}
}

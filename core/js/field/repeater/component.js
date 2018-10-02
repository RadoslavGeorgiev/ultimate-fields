import React, { Component, Fragment } from 'react';
import { find } from 'lodash';

import Button from './../../components/button';
import Group from './group';

export default class RepeaterField extends Component {
	/**
	 * Locates the definition of a group based on its type.
	 *
	 * @param {string} type The type of the group.
	 * @type  {Object}      The Settings of the group.
	 */
	findGroup( type ) {
		const { groups } = this.props;

		return find( groups, { id: type } );
	}

	render() {
		const { value } = this.props;

		return (
			<Fragment>
				{ value.map( this.renderGroup ) }

				<Button type="primary" icon="plus" onClick={ this.addGroup }>Add group</Button>
			</Fragment>
		);
	}

	renderGroup = ( data, index ) => {
		const { name, datastore } = this.props;

		const settings = this.findGroup( data.__type );

		return <Group
			key={ index }
			index={ index }
			datastore={ [ ...datastore, name, index ] }
			number={ index + 1 }
			containerId={ data.__id }
			{ ...settings }
		/>
	}

	addGroup = () => {
		this.props.addRow();
	}
}

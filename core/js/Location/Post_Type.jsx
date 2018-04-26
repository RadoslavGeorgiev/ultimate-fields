import React from 'react';
import Location from './Location.jsx';
import Form from './../Form.jsx';
import Field from './../Field.jsx';
import RepeaterGroup from './../Container/RepeaterGroup.jsx';

export default class Post_Type extends Location {
	state: {
		data: {}
	}

	componentWillMount() {
		const { data } = this.props;
		this.setState({ data });
	}

	render() {
		const { element, settings, data } = this.props;
		const { id, fields } = settings;

		return <React.Fragment>
			<Form
				data={ data }
				children={ this.generateFields( fields ) }
				ref={ form => this.form = form }
				onChange={ data => this.setState({ data }) }
			/>
			{ this.getHiddenField( 'uf_post_type_' + id ) }
		</React.Fragment>
	}

	generateFields( raw ) {
		const fields = raw.map( field => {
			if( field.type === 'Repeater' ) {
				field.children = this.prepareRepeaterGroups( field.groups );
			}

			return <Field {...field} key={ field.name } />
		});

		return fields;
	}

	prepareRepeaterGroups( groups ) {
		return groups.map( group => {
			return React.createElement( RepeaterGroup, {
				...group,
				children: this.generateFields( group.fields )
			});
		});
	}
}

import React from 'react';
import Location from './Location.jsx';
import Form from './../Form.jsx';
import Loader from './../Loader.jsx';

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
		const { id, fields, layout, description_position } = settings;

		const loader = new Loader( fields );

		return <React.Fragment>
			<Form
				data={ data }
				children={ loader.load() }
				ref={ form => this.form = form }
				onChange={ data => this.setState({ data }) }
				className="uf-fields--boxed"
				layout={ layout }
				description_position={ description_position }
			/>
			{ this.getHiddenField( 'uf_post_type_' + id ) }
		</React.Fragment>
	}
}

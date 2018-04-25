import React from 'react';
import Location from './Location.jsx';
import Form from './../Form.jsx';
import Field from './../Field.jsx';

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

	componentDidMount() {
		// const form = document.getElementById( 'post' );
		//
		// this.submissionCallback = e => {
		// 	const errors = this.form.validate();
		// 	if( errors.length ) {
		// 		console.log(errors);
		// 		e.preventDefault();
		// 	}
		// };
		//
		// // Add a submission handler
		// form.addEventListener( 'submit', this.submissionCallback );
	}

	componentWillUnmount() {
		document.getElementById( 'post' ).removeEventListener( 'submit', this.submissionCallback );
	}

	generateFields( raw ) {
		const fields = raw.map( field => {
			return <Field {...field} key={ field.name } />
		});

		return fields;
	}
}

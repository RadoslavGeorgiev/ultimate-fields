import React from 'react';

import { getFieldElement, getFieldInput } from './../field/';

export default class Container extends React.Component {
	render() {
		const { fields, datastore } = this.props;

		return fields.map( raw => {
			const field = { ...raw, datastore };

			const Element = getFieldElement( field );
			const Input = getFieldInput( field );

			return <Element { ...field } key={ field.name }>
				<Input { ...field } />
			</Element>
		} );
	}
}

import React from 'react';
import Field from './../Field.jsx';

export default class Select extends Field {
	renderInput() {
		const { name, value, options, onValueChanged } = this.props;
		let children;

		if( options ) {
			children = [];

			for( let key in options ) {
				children.push( <option key={ key } value={ key }>{ options[ key ] }</option> )
			}
		} else {
			children = this.props.children;
		}

		return <select
			id={ this.id }
			value={ this.getValue() }
			children={children}
			onChange={ e => onValueChanged( name, e.target.value ) }
			className="field__input field__input--select"
			ref="input"
		/>
	}

	componentDidMount() {
		const { input } = this.refs;
		const { use_select2 } = this.props;

		if( use_select2 ) {
			jQuery( input ).select2();			
		}
	}
}

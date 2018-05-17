import React from 'react';
import Location from './Location.jsx';

export default class Post_Type extends Location {
	box = false;

	render() {
		const { id } = this.props.settings;

		const props = {
			className: 'uf-fields--boxed'
		}

		return <React.Fragment>
			{ this.renderForm( props ) }
			{ this.getHiddenField( 'uf_post_type_' + id ) }
		</React.Fragment>
	}

	associateWithBox( box ) {
		this.box = box.parentNode.parentNode;
		this.checkRules();
	}

	componentDidUpdate() {
		this.checkRules();
	}

	checkRules() {
		const hidden = false;

		this.box.style.display = hidden ? 'none' : null;
	}
}

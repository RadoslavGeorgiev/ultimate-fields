import React from 'react';
import Location from './Location.jsx';

export default class Post_Type extends Location {
	box = false;

	state = Object.assign( {}, this.state, {
		visible: true
	});

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
	}

	/**
	 * Checks if a rule is empty.
	 */
	empty( arr ) {
		return 0 === arr.visible.length && 0 === arr.hidden.length;
	}

	/**
	 * Checks a single value based on rules.
	 */
	checkSingleValue( value, rules ) {
		if( rules.hidden.length && rules.hidden.indexOf( value ) != -1 )
			return false;

		if( rules.visible.length ) {
			return rules.visible.indexOf( value ) != -1;
		} else {
			return true;
		}
	}

	/**
	 * Checks multiple values based on rukes.
	 */
	checkMultipleValues( values, rules ) {
		var hidden  = false,
			visible = 0 === rules.visible.length;

		_.each( values, function( value ) {
			if( rules.hidden.length && -1 != rules.hidden.indexOf( value ) ) {
				hidden = true;
			}

			if( -1 != rules.visible.indexOf( value ) ) {
				visible = true;
			}
		});

		return ! hidden && visible;
	}

	setEnvironment( env ) {
		const { locations } = this.props.settings;
		let match = false;

		locations.forEach( location => {
			const { templates, levels, formats, stati, parents, terms } = location;
			const { template, format, status, level, parent } = env;
			let allSatisfied = true;

			if( templates && ! this.empty( templates ) ) {
				if( ! this.checkSingleValue( template, templates ) ) {
					allSatisfied = false;
				}
			}

			if( levels && ! this.empty( levels ) ) {
				if( ! this.checkSingleValue( level, levels ) ) {
					allSatisfied = false;
				}
			}

			if( terms ) {
				_.forEach( terms, ( rules, slug  ) => {
					const rule = 'tax_' + slug;

					if( rule in env ) {
						if( ! this.checkMultipleValues( env[ rule ], rules ) ) {
							allSatisfied = false;
						}
					}
				});
			}

			if( formats && ! this.empty( formats ) ) {
				if( ! this.checkSingleValue( format, formats ) ) {
					allSatisfied = false;
				}
			}

			if( stati && ! this.empty( stati ) ) {
				if( ! this.checkSingleValue( status, stati ) ) {
					allSatisfied = false;
				}
			}

			if( parents && ! this.empty( parents ) ) {
				if( ! this.checkSingleValue( parent, parents ) ) {
					allSatisfied = false;
				}
			}

			if( allSatisfied ) {
				match = true;
			}
		});

		this.setState({
			visible: match
		})
	}

	componentDidUpdate() {
		const { visible } = this.state;

		this.box.style.display = visible ? null : 'none';
	}

	validate() {
		if( this.state.visible ) {
			return this.refs.form.validate();
		} else {
			return [];
		}
	}
}

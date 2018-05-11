import React from 'react';
import Button from './../../Button.jsx';
import FieldsEditor from './../../UI/FieldsEditor.jsx';

export default class Rule extends React.Component {
	state = {
		shouldReload: false
	}

	render() {
		const { selector, compare, onDelete } = this.props;

		const selectors   = this.renderSelectors();
		const comparators = this.renderComparators( selector );
		const values      = this.renderValue( selector, compare );

		return <div className="uf-rule">
			<div className="uf-rule__element">
				<select name="selector" value={ selector } onChange={ this.selectChanged.bind( this ) }>{ selectors }</select>
			</div>

			<div className="uf-rule__element">
				<select name="compare" value={ compare } onChange={ this.selectChanged.bind( this ) }>{ comparators }</select>
			</div>

			{ values && <div className="uf-rule__element">
				{ values }
			</div> }

			<Button onClick={ onDelete } className="uf-rule__remove" icon="dashicons-trash" type="secondary" />
		</div>
	}

	renderSelectors() {
		return Rule.getSelectors().map( group => {
			const { label, fields } = group;

			const options = fields.map( field => {
				const { label, name } = field;

				return <option key={ name } value={ name }>{ label }</option>;
			});

			return <optgroup key={ label } label={ label }>{ options }</optgroup>
		})
	}

	renderComparators( selector ) {
		return Rule.getComparators( selector ).map( comparator => {
			const { compare, label } = comparator;
			return <option key={ compare } value={ compare }>{ label }</option>
		});
	}

	renderValue( selector, compare ) {
		const { value } = this.props;

		const selectors  = Rule.getComparators( selector );
		const comparator = selectors.find( comparator => comparator.compare == compare );

		if( ! comparator.operand ) {
			return null;
		}

		// Locate the operand
		const PreviewClass = Rule.getPreviewClass( selector );
		const operand = PreviewClass.getOperand( Rule.getSelectorData( selector ) );

		// Add the necessary handlers
		return React.cloneElement( operand, {
			value: value || false,
			onValueChanged: ( name, value ) => {
				this.updateProp( 'value', value )
			}
		});
	}

	selectChanged( e ) {
		this.updateProp( e.target.name, e.target.value );
	}

	updateProp( name, value ) {
		const { onUpdate } = this.props;

		const updated = {
			selector: this.props.selector,
			compare:  this.props.compare,
			value:    this.props.value
		}

		updated[ name ] = value;
		onUpdate( updated );
	}

	/**
	 * Static handlers.
	 */

	static cache = {}

	static clearCache() {
		Rule.cache = {};
	}

	static getSelectors() {
		if( Rule.cache.selectors ) {
			return Rule.cache.selectors;
		}

		const groups = [];
		const contexts = FieldsEditor.contexts;

		for( let i = contexts.length - 1; i >= 0; i-- ) {
			const context = contexts[ i ];
			const options = [];
			const prefix  = '../'.repeat( i );

			context.fields.forEach( field => {
				const { name, label } = field;

				if( context.field && field.name === context.field.name ) {
					return;
				}

				options.push({
					label,
					name: prefix + name
				});
			});

			if( options.length ) {
				groups.push({
					label:  context.name,
					fields: options
				});
			}
		}

		return Rule.cache.selectors = groups;
	}

	static getSelectorData( name ) {
		const context = FieldsEditor.contexts[ FieldsEditor.contexts.length - 1 ];
		return context.fields.find( field => field.name == name );
	}

	static getPreviewClass( name ) {
		const data = Rule.getSelectorData( name );

		if( ! data ) {
			return false;
		}

		return FieldsEditor.getFieldPreviewClass( data );
	}

	static getComparators( name ) {
		return Rule.getPreviewClass( name ).getComparators();
	}

	static getDefaultRule() {
		const selectors = Rule.getSelectors();
		const selector = selectors[ 0 ].fields[ 0 ].name;

		const comparators = Rule.getComparators( selector );
		const compare = comparators[ 0 ].compare;

		const value = null;

		return { selector, compare, value };
	}
}

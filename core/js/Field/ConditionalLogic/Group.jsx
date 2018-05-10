import React from 'react';
import Rule from './Rule.jsx';
import Button from './../../Button.jsx';

export default class Group extends React.Component {
	state = {
		rules: this.props.rules
	}

	render() {
		const { onDelete } = this.props;

		const rules = this.state.rules.map( ( rule, i ) => {
			return React.createElement( Rule, {
				...rule,
				key:      i,
				onUpdate: updated => this.updateRule( i, updated ),
				onDelete: () => this.deleteRule( i )
			});
		});

		const addButton = React.createElement( Button, {
			className: "uf-rules__add",
			icon:      "dashicons-plus",
			children:  'Add rule',
			onClick:   this.addRule.bind( this )
		});

		const removeButton = React.createElement( Button, {
			type:     'secondary',
			icon:     'dashicons-trash',
			children: 'Delete group',
			onClick:  onDelete
		});

		return <div className="uf-rules">
			<div className="uf-rules__body">
				<div className="uf-rules__rules">
					<span className="uf-rules__and">
						<strong>and</strong>
					</span>

					{ rules }
				</div>

				{ addButton }
			</div>

			<div className="uf-rules__footer">
				{ removeButton }
			</div>
		</div>
	}

	stateUpdated() {
		this.props.onUpdate( this.state );
	}

	addRule() {
		const { rules } = this.state;

		this.setState({
			rules: rules.concat([ Rule.getDefaultRule() ])
		}, this.stateUpdated.bind( this ) );
	}

	updateRule( index, updated ) {
		const { rules } = this.state;

		this.setState({
			rules: rules.map( ( rule, i ) => i === index ? updated : rule )
		}, this.stateUpdated.bind( this ) );
	}

	deleteRule( index ) {
		const { onDelete } = this.props;
		const rules = this.state.rules.filter( ( rule, i ) => i !== index );

		if( rules.length ) {
			this.setState({
				rules: rules
			}, this.stateUpdated.bind( this ) );
		} else {
			onDelete();
		}
	}
}

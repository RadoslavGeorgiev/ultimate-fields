import React from 'react';
import Rule from './Rule.jsx';
import Button from './../../Button.jsx';

export default class Group extends React.Component {
	state = {
		rules: []
	}

	render() {
		const { onDelete } = this.props;
		const { rules } = this.state;

		return <div className="uf-rules">
			<div className="uf-rules__body">
				<div className="uf-rules__rules">
					<span className="uf-rules__and"><strong>and</strong></span>

					{ rules.map( ( rule, i ) => <Rule key={ i } /> ) }
				</div>

				<Button className="uf-rules__add" icon="dashicons-plus" onClick={ this.addRule.bind( this ) }>Add rule</Button>
			</div>

			<div className="uf-rules__footer">
				<Button type="secondary" icon="dashicons-trash" onClick={ onDelete }>Delete group</Button>
			</div>
		</div>
	}

	addRule() {
		this.setState({
			rules: this.state.rules.concat([{}])
		}, () => {
			this.props.onUpdate( this.state.rules )
		});
	}
}

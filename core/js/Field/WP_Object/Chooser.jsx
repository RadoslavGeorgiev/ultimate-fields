import React from 'react';
import { map } from 'lodash';
import Button from './../../Button.jsx';
import Item from './Item.jsx';

export default class Chooser extends React.Component {
	state = {
		selected: this.props.preselected || false
	}

	render() {
		const { show_filters, filters, items, preselected, onClose, onSelect } = this.props;
		const { selected } = this.state;

		const filterOptions = map( filters, ( options, label ) => {
			return <optgroup label={ label } key={ label }>
				{ map( options, ( text, value ) => <option value={ value } key={ value }>{ text }</option> ) }
			</optgroup>
		});

		return <div className="uf-chooser__wrapper">
			<div className="uf-chooser">
				<div className={ 'uf-chooser__filter' + ( show_filters ? '' : ' uf-chooser__filter--mini' ) }>
					<input type="text" className="uf-chooser__input" placeholder="Search..." />

					{ show_filters && <div className="uf-chooser__type">
						<select multiple="multiple" size="1" ref="filterSelect">
							{ filterOptions }
						</select>
					</div> }
				</div>

				<div className="uf-chooser__list">
					{ items.map( item => <Item
						key={ item.id } { ...item }
						selected={ item.id == selected }
						onSelected={ this.selectItem.bind( this ) }
						disableClicks={ true }
					/> ) }
				</div>

				<div className="uf-chooser__footer">
					<Button
						disabled={ ! selected }
						icon="dashicons-yes"
						onClick={ () => onSelect( selected ) }
						children={ uf_l10n['select'] }
					/>

					<span className="spinner uf-object__spinner" />

					<Button
						type="secondary"
						icon="dashicons-no"
						className="uf-chooser-button-right"
						onClick={ () => onClose() }
						children={ uf_l10n['cancel'] }
					/>
				</div>
			</div>
		</div>
	}

	componentDidMount() {
		if( this.refs.filterSelect ) {
			jQuery( this.refs.filterSelect ).select2({
				placeholder: uf_l10n['object-filter']
			});
		}
	}

	selectItem( id ) {
		this.setState({
			selected: id
		});
	}
}

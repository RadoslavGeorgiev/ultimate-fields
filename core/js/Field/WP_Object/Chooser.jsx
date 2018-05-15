import React from 'react';
import _ from 'lodash';
import Button from './../../Button.jsx';
import Item from './Item.jsx';

export default class Chooser extends React.Component {
	state = {
		items:      this.props.initialData.items || [],
		selected:   this.props.preselected.map( item => item.id || item ) || [],
		searchText: '',
		filters:    [],
		loading:    false,
		data:       this.props.initialData || {}
	}

	constructor() {
		super( ...arguments );

		this.applyDebouncedFilters = _.debounce( this.applyFilters.bind( this ), 500 );
	}

	render() {
		const { show_filters, max, onClose, onSelect } = this.props;
		const { items, selected, searchText, loading } = this.state;

		// Pre-render the filters
		let filtersClass = 'uf-chooser__filter';
		if( ! show_filters ) filtersClass += ' uf-chooser__filter--mini';
		const filters = <div className={ filtersClass }>
			<input type="text" className="uf-chooser__input" placeholder="Search..." value={ searchText } onChange={ this.textChanged.bind( this ) } />
			{ this.renderFilters() }
		</div>

		// Pre-render the items
		const itemsList = <div className="uf-chooser__list" onScroll={ this.onScroll.bind( this ) }>
			{ items.map( item => {
				const isSelected = -1 != selected.indexOf( item.id );
				const isDisabled = max && ! isSelected && selected.length >= max;

				return <Item
					key={ item.id } { ...item }
					selected={ isSelected }
					disabled={ isDisabled }
					onSelected={ this.selectItem.bind( this ) }
					disableClicks={ true }
				/>;
			}) }
		</div>

		// Pre-render the buttons
		const selectButton = React.createElement( Button, {
			disabled: ! selected.length,
			icon:     'dashicons-yes',
			onClick:  () => onSelect( selected ),
			children: uf_l10n['select']
		});

		const cancelButton = React.createElement( Button, {
			type:      'secondary',
			icon:      'dashicons-no',
			className: 'uf-chooser-button-right',
			onClick:   onClose,
			children:  uf_l10n['cancel']
		});

		return <div className="uf-chooser__wrapper">
			<div className="uf-chooser">
				{ filters }
				{ itemsList }

				<div className="uf-chooser__footer">
					{ selectButton }
					{ loading && <span className="spinner is-active uf-object__spinner" /> }
					{ cancelButton }
				</div>
			</div>
		</div>
	}

	renderFilters() {
		const { show_filters, initialData: { filters } } = this.props;
		const { filters: active } = this.state;

		if( ! this.props.show_filters ) {
			return null;
		}

		return <div className="uf-chooser__type">
			<select multiple="multiple" size="1" ref="filterSelect" value={ active || [] } onChange={ this.setFilters.bind( this ) }>
				{ _.map( filters, ( options, label ) =>
					<optgroup label={ label } key={ label }>
						{ _.map( options, ( text, value ) =>
							<option value={ value } key={ value }>{ text }</option>
						) }
					</optgroup>
				) }
			</select>
		</div>
	}

	setFilters( value ) {
		this.setState({
			filters: value
		});

		this.applyFilters();
	}

	textChanged( e ) {
		this.setState({
			searchText: e.target.value
		});

		this.applyDebouncedFilters();
	}

	applyFilters() {
		const { loadObjects } = this.props;
		const { searchText, filters } = this.state;

		this.setState({
			loading: true
		});

		loadObjects({
			mode:       'search',
			filters:    filters,
			searchText: searchText
		}).then( data => {
			this.setState({
				loading: false,
				data:    data,
				items:   data.items
			});
		});
	}

	componentDidMount() {
		const { filterSelect } = this.refs;

		if( ! filterSelect ) {
			return;
		}

		jQuery( filterSelect ).select2({
			placeholder: uf_l10n['object-filter']
		}).on( 'change', () => {
			this.setFilters( jQuery( filterSelect ).val() );
		});
	}

	selectItem( id ) {
		const { multiple, max } = this.props;
		const { selected, items } = this.state;
		const state = {};

		if( multiple ) {
			if( -1 === selected.indexOf( id ) ) {
				// adding

				if( max && selected.length == max ) {
					alert( 'You have reached the maximum amount of items.' );
					return;
				}

				state.selected = selected.concat([ id ]);
			} else {
				// removing
				state.selected = selected.filter( item => id !== item );
			}
		} else {
			state.selected = id;
		}

		this.setState( state );
	}

	onScroll( e ) {
		const { loadObjects, filters, searchText } = this.props;
		const { loading, data: { page, more, items } } = this.state;

		if( loading ) {
			return;
		}

		const list     = e.target;
		const height   = list.offsetHeight;
		const full     = list.scrollHeight;
		const scrolled = list.scrollTop;

		if( 120 < full - height - scrolled ) {
			return;
		}

		if( ! more ) {
			return;
		}

		this.setState({
			loading: true
		});

		loadObjects({
			mode:       'search',
			filters:    filters,
			searchText: searchText,
			page:       parseInt( page ) + 1
		}).then( data => {
			this.setState({
				loading: false,
				items:   items.concat( data.items ),
				data:    data
			});
		});
	}
}

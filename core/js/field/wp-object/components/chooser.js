/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { map } from 'lodash';

/**
 * Internal depenencies
 */
import {
	WP_OBJECT_INITIAL_MODE,
	WP_OBJECT_SEARCH_MODE,
} from './../constants';
import Button from 'components/button';
import Item from './item';
import translate from 'utils/l10n';
import request from 'utils/request';
import { cacheObject } from '../state/actions.js';

/**
 * Handles the chooser of WP Object fields.
 */
class Chooser extends Component {
	static propTypes = {
		selected: PropTypes.arrayOf( PropTypes.string ).isRequired,
		name:     PropTypes.string.isRequired,
		nonce:    PropTypes.string.isRequired,
		multiple: PropTypes.bool,
		onLoad:   PropTypes.func,
		onSelect: PropTypes.func.isRequired,
		onClose:  PropTypes.func.isRequired,
	}

	static defaultProps = {
		multiple: false,
	}

	constructor() {
		super( ...arguments );

		this.state = {
			didInitialLoad: false,
			availableFilters: {},
			objects: [],
			selected: this.props.selected,
		};
	}

	/**
	 * Renders the chooser, but only when loaded.
	 * 
	 * @return {Element|null}
	 */
	render() {
		const { didInitialLoad } = this.state;

		if ( didInitialLoad ) {
			return this.renderFullUI();
		}

		return null;
	}

	/**
	 * When the component is mounted, start loading immediately.
	 */
	componentDidMount() {
		this.loadItems();
	}
	
	/**
	 * Loads items to display from PHP.
	 * 
	 * @param  {string} mode    An indicator whether this is the initial load.
	 * @param  {Object} filters A hash of filters to use.
	 * @param  {number} page    The index of the page to load.
	 * @return {Promise}
	 */
	loadItems( mode = WP_OBJECT_INITIAL_MODE, filters = {}, page = 1 ) {
		const {
			name,
			field_id,
			nonce,
			selected,
			multiple,
			onLoad,
			cacheObject,
		} = this.props;

		request( `get_objects_${name}`, {
			field_id,
			nonce,
			selected: multiple ? selected : [ selected ],
			page,
			mode: (
				WP_OBJECT_SEARCH_MODE == mode
					? WP_OBJECT_SEARCH_MODE
					: WP_OBJECT_INITIAL_MODE
			),
			filters: {
				filter: true,
				...filters,
			},
		} )
		.then( result => {
			if ( onLoad ) {
				onLoad();
			}

			this.setState( {
				didInitialLoad: true,
			} );

			return result;
		} )
		.then( ( { items, filters, more, offset, page, total } ) => {
			// Save the filters & items
			if ( filters ) {
				this.setState( state => ( {
					filters,
					objects: [ ...state.objects, ...items ],
				} ) );

				items.forEach( item => cacheObject( item ) );
			}
		} );
	}

	/**
	 * Renders the full interface of the chooser, in loaded state.
	 * 
	 * @return {Element}
	 */
	renderFullUI() {
		const { hide_filters } = this.props;
		const { objects, filters, selected } = this.state;

		const types = ! hide_filters && map( filters, ( options, label ) => {
			return <optgroup label={ label } key={ label }>
				{ map( options, ( text, value ) => 
					<option value={ value } key={ value }>{ text }</option>
				) }
			</optgroup>;
		} );

		return <div className="uf-chooser">
			<div className={ classNames( 'uf-chooser__filter', ! types && 'uf-chooser__filter--mini' ) }>
				<input
					type="text"
					className="uf-chooser__filter-input"
					placeholder={ translate( 'object-search' ) }
				/>

				{ types && <div className="uf-chooser__filter-type">
					<select multiple="multiple" size="1" ref={ this.startSelect2 }>
						{ types }
					</select>
				</div> }
			</div>

			<div className="uf-chooser__list">
				{ map( objects, this.renderListItem ) }
			</div>

			<div className="uf-chooser__footer">
				<Button icon="yes" onClick={ this.saveSelection } disabled={ 0 === selected.length }>
					{ translate( 'object-select' ) }
				</Button>

				<Button icon="no" className="uf-button--right" onClick={ this.closeChooser } type="secondary">
					{ translate( 'cancel' ) }
				</Button>
			</div>
		</div>;
	}

	/**
	 * Starts select2 for the filter.
	 * 
	 * @param {HTMLElement} select The multiselect field in the filter.
	 */
	startSelect2 = ( select ) => {
		if ( ! select ) {
			return;
		}
		
		jQuery( select ).select2( {
			placeholder: translate( 'object-filter' )
		} );
	}

	/**
	 * Renders an individual item in the list.
	 * 
	 * @param {Object} item The descriptor of the item.
	 * @return {Element}
	 */
	renderListItem = ( item ) => {
		const { selected } = this.state;

		return <Item
			{ ...item }
			key={ item.id }
			onClick={ this.selectItem }
			isSelected={ -1 !== selected.indexOf( item.id ) }
		/>;
	}

	/**
	 * Closes the chooser.
	 */
	closeChooser = () => {
		this.props.onClose();
	}

	selectItem = ( id ) => {
		const { multiple } = this.props;
		const { selected } = this.state;

		this.setState( {
			selected: multiple ? [ ...selected, id ] : id,
		} );
	}

	saveSelection = () => {
		const { onSelect } = this.props;
		const { selected } = this.state;

		onSelect( selected );
	}
}

export default connect(
	null,
	( dispatch ) => bindActionCreators( { cacheObject }, dispatch )
)( Chooser );
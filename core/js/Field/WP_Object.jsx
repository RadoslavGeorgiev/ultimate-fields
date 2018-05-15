import React from 'react';
import Field from './../Field.jsx';
import Button from './../Button.jsx';
import Chooser from './WP_Object/Chooser.jsx';
import Item from './WP_Object/Item.jsx';
import request from './../PHP/request.js';
import cache from './../Cache.js';

export default class WP_Object extends Field {
	state = {
		loading: false,
		chooserOpen: false
	}

	static defaultProps = {
		...Field.defaultProps,
		show_filters: true
	}

	static getStores( type, field, data, source ) {
		const name = field.props.name + '_prepared';

		( data[ name ] || [] ).forEach( item => {
			cache.set( 'object_' + item.id, item );
		});

		return Field.getStores( type, field, data, source );
	}

	getValue() {
		// Load the standard value
		const value = Field.prototype.getValue.apply( this );
		if( ! value ) {
			return null;
		}

		// Check if there is a cache match
		return cache.get( 'object_' + value );
	}

	renderInput() {
		const { name, source, button_text } = this.props;
		const { loading, chooserOpen } = this.state;

		const value = this.getValue();
		const open  = this.openChooser.bind( this );

		return <React.Fragment>
			{ value
				? this.renderPreview( value )
				: <React.Fragment>
					<Button onClick={ open } icon="dashicons-search">
						{ button_text || uf_l10n['select-item'] }
					</Button>

					{ loading && <span className="spinner is-active uf-object__spinner" /> }
				</React.Fragment>
			}

			{ chooserOpen && this.renderChooser() }
		</React.Fragment>
	}

	loadObjects( args ) {
		const { name, nonce, multiple } = this.props;

		const body = Object.assign( {
			uf_action:  'get_objects_' + name,
			uf_ajax:    true,
			nonce:      nonce,
			mode:       'initial',
			page:       1,
			filters:    {},
			searchText: '',
			selected:   []
		}, args || {} );

		// Add the selected items
		const value = this.getValue();
		if( ( ! multiple && value ) || ( multiple && value.length ) ) {
			body.selected = multiple ? value.map( item => item.id ) : [ value.id ];
		}

		return new Promise( resolve => {
			request({ body })
				.catch( request => {
					this.setState({
						loading: false
					});
				})
				.then( response => {
					response.items.map( item => {
						cache.set( 'object_' + item.id, item );
					});

					resolve( response );
				});
		});
	}

	openChooser() {
		const { multiple } = this.props;

		// Indicate that something is happening
		this.setState({
			loading: true
		});

		// Load the objects
		this.loadObjects().then( data => {
			this.setState({
				loading:     false,
				chooserOpen: true,
				initialData: data
			});
		});
	}

	getPreselectedItems() {
		const value = this.getValue();

		if( value ) {
			return [ value.id ];
		} else {
			return [];
		}
	}

	renderChooser() {
		const { show_filters, multiple, max } = this.props;
		const { initialData } = this.state;

		const preselected = this.getPreselectedItems();

		return React.createElement( Chooser, {
			show_filters, multiple, max, initialData, preselected,
			onClose: () => {
				this.setState({
					chooserOpen: false
				});
			},
			onSelect: selected => {
				this.setState({
					chooserOpen: false
				});

				this.updateItem( selected );
			},
			loadObjects: this.loadObjects.bind( this )
		});
	}

	updateItem( item ) {
		const { name, onValueChanged } = this.props;
		onValueChanged( name, item );
	}

	renderPreview( item ) {
		const { loading, chooserOpen } = this.state;

		return <div className="uf-object">
			<Item { ...item } />

			<div className="uf-object__buttons">
				<Button
					children=""
					icon={ 'dashicons-arrow-' + ( chooserOpen ? 'up' : 'down' ) }
					type="secondary"
					onClick={ () => this.toggleChooser() }
				/>

				<Button
					children={ uf_l10n['remove'] }
					icon="dashicons-no"
					className="uf-button-right"
					onClick={ () => this.clearValue() }
				/>

				{ loading
					 ? <span className="spinner is-active uf-object__spinner" />
					 : <span className="spinner uf-object__spinner" />
				}
			</div>
		</div>
	}

	toggleChooser() {
		const { chooserOpen } = this.state;

		if( chooserOpen ) {
			this.setState({ chooserOpen: false });
		} else {
			this.openChooser();
		}
	}

	clearValue() {
		const { name, onValueChanged } = this.props;
		onValueChanged( name, false );
	}
}

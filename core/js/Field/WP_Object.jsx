import React from 'react';
import Field from './../Field.jsx';
import Button from './../Button.jsx';
import Chooser from './../WP_Object/Chooser.jsx';
import Item from './../WP_Object/Item.jsx';
import request from './../request.js';

export default class WP_Object extends Field {
	state = {
		loading: false,
		chooserOpen: false
	}

	static defaultProps = {
		show_filters: true
	}

	componentWillMount() {
		if( ! this.getValue() ) {
			return;
		}

		const { cacheValue, getContext, source, name } = this.props;
		const context = getContext( source );

		context[ name + '_prepared' ].forEach( item => cacheValue( 'object_' + item.id, item ) )
	}

	renderInput() {
		const { name, source, button_text, getContext, getCachedValue } = this.props;
		const { loading, chooserOpen } = this.state;
		const prepared = this.getValue() && getCachedValue( 'object_' + this.getValue() );

		return <React.Fragment>
			{ prepared
				? this.getPreview( prepared )
				: <React.Fragment>
					<Button
						onClick={ this.openChooser.bind( this ) }
						icon="dashicons-search"
						className="uf-object__select"
						children={ button_text || uf_l10n['select-item'] }
					/>

					{ loading && <span className="spinner is-active uf-object__spinner" /> }
				</React.Fragment>
			}

			{ chooserOpen && this.getChooser() }
		</React.Fragment>
	}

	openChooser() {
		const { name, nonce, multiple, value, cacheValue } = this.props;

		this.setState({
			loading: true
		});

		let filters = false, mode = false, page = false;

		const body = {
			uf_action: 'get_objects_' + name,
			nonce:     nonce,
			filters:   Object.assign( { filter: true }, filters || {} ),
			selected:  multiple ? value : [ value ],
			mode:      'search' == mode ? 'search' : 'initial',
			page:      page || 1,
			uf_ajax:   true
		};

		request({ body })
			.catch( request => this.setState({ loading: false }) )
			.then( response => {
				this.setState({
					loading: false,
					chooserOpen: true,
					data: response
				});

				response.items.map( item => {
					cacheValue( 'object_' + item.id, item );
				});
			});
	}

	getChooser() {
		const { name, show_filters, onValueChanged } = this.props;
		const { filters, items } = this.state.data;

		return React.createElement( Chooser, {
			show_filters, filters, items,
			preselected: this.getValue(),
			onClose: () => {
				this.setState({
					chooserOpen: false
				});
			},
			onSelect: selected => {
				this.setState({
					chooserOpen: false
				});

				onValueChanged( name, selected );
			}
		});
	}

	getPreview( item ) {
		return <div className="uf-object">
			<Item { ...item } />

			<div className="uf-object__buttons">
				<Button
					children=""
					icon="dashicons-arrow-down"
					type="secondary"
					onClick={ () => this.toggleChooser() }
				/>

				<Button
					children={ uf_l10n['remove'] }
					icon="dashicons-no"
					className="uf-button-right"
					onClick={ () => this.clearValue() }
				/>

				<span className="spinner uf-object__spinner" />
			</div>
		</div>
	}

	toggleChooser() {
		const { chooserOpen, data } = this.state;

		if( chooserOpen ) {
			this.setState({ chooserOpen: false });
		} else {
			if( data ) {
				this.setState({ chooserOpen: true });
			} else {
				this.openChooser();
			}
		}
	}

	adadsa() {
		// @todo
		if( that.chooser ) {
			that.chooser.remove();
		} else {
			$spinner.addClass( 'is-active' );

			that.choose(function() {
				$spinner.removeClass( 'is-active' );
				toggleButton.model.set( 'icon', 'dashicons-arrow-up' );
			});
		}
	}

	clearValue() {
		const { name, onValueChanged } = this.props;
		onValueChanged( name, false );
	}
}

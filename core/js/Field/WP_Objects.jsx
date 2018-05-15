import React from 'react';
import WP_Object from './WP_Object.jsx';
import Button from './../Button.jsx';
import ObjectsItem from './WP_Object/ObjectsItem.jsx';
import cache from './../Cache.js';

export default class WP_Objects extends WP_Object {
	static getDefaultValue() {
		return [];
	}

	renderInput() {
		const { name, source, button_text, getContext } = this.props;
		const { loading, chooserOpen } = this.state;
		const prepared = ( this.getValue() || [] ).map( item => cache.get( 'object_' + item ) );

		return <React.Fragment>
			{ prepared.length
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

	getPreview( items ) {
		const { max } = this.props;
		const { loading } = this.state;

		const showButton = ! max || items.length < max;

		return <div className="uf-objects">
			<div className="uf-objects__list" ref="list">
				{ items.map( item =>
					<ObjectsItem
						key={ item.id }
						item={ item }
						onRemove={ () => this.removeItem( item ) }
					/>
				) }
			</div>

			<div className="uf-objects__buttons">
				<Button
					children={ uf_l10n['add-items'] }
					icon="dashicons-plus"
					type="secondary"
					disabled={ ! showButton }
					onClick={ () => this.toggleChooser() }
				/>

				<Button
					children={ uf_l10n['remove-all'] }
					icon="dashicons-no"
					className="uf-button-right"
					onClick={ () => this.clearValue() }
				/>

				{ loading
					? <span className="spinner is-active uf-object__spinner" />
					: <span className="spinner uf-object__spinner" /> }
			</div>
		</div>
	}

	componentDidMount() {
		const { name, onValueChanged } = this.props;
		const list = this.refs.list;

		if( ! list ) {
			return;
		}

		const $list = jQuery( list );

		$list.sortable({
			handle: '.uf-objects__handle',
			axis: 'y',
			stop: function() {
				const ids = [];

				$list.children().each(function() {
					ids.push( this.dataset.id );
				});

				onValueChanged( name, ids );
			}
		});
	}

	removeItem( item ) {
		const { name, onValueChanged } = this.props;

		const value = this.getValue().filter( selected => selected != item.id );
		onValueChanged( name, value );
	}
}

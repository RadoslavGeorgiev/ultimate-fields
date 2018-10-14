/**
 * External dependencies
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * Internal dependencies
 */
import OverlayAlert from 'components/overlay-alert';

// Contains all layers of the overlay
const layers = [];
let currentAlert = null;
let node = null;

export const addLayer = ( {
	title,
	body,
	buttons = [],
	tabs = null,
} = {} ) => {
	layers.push( {
		title,
		body,
		buttons,
		tabs,
	} );

	renderOverlay();
};

export const popLayer = () => {
	const layer = layers.pop();

	if ( layer.onRemove ) {
		layer.onRemove();
	}

	renderOverlay();
}

export const alert = ( title, body ) => {
	if ( currentAlert ) {
		alert( 'An alert was already created!' );
		return;
	}

	const onClose = () => {
		currentAlert = null;
		renderOverlay();
	}

	currentAlert = <OverlayAlert title={ title } onClose={ onClose }>{ body }</OverlayAlert>;
	renderOverlay();
}

export const renderOverlay = () => {
	// Destroy the node if there are no more levels
	if ( ! layers.length && node ) {
		document.body.removeChild( node );
		node = null;
		return;
	}

	// Create a node if needed
	if ( ! node ) {
		node = document.createElement( 'div' );
		node.classList.add( 'uf-overlay' );
		document.body.appendChild( node );
	}

	// Prepare stuff
	const layer = layers[ layers.length - 1 ];
	const { title, body, buttons, tabs } = layer

	if ( tabs ) {
		node.classList.add( 'uf-overlay--has-tabs' );
	}

	// Render
	ReactDOM.render( [
		<div className="uf-overlay__background" key="bg" />,

		<div className="uf-overlay__box" key="box">
			<div className="uf-overlay__header">
				<h2 className="uf-overlay__title">{ title }</h2>

				<button type="button" className="uf-overlay__close" onClick={ popLayer }>
					<span className="dashicons dashicons-no-alt"></span>
					<span className="screen-reader-text">Close overlay</span>
				</button>

				{ tabs }
			</div>

			<div className="uf-overlay__body">
				<div className="uf-overlay__screen">
					{ body }
				</div>
			</div>

			<div className="uf-overlay__footer">
				{ buttons }
			</div>
			
			{ currentAlert }
		</div>
		], node
	);
}

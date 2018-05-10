import React from 'react';
import ReactDOM from 'react-dom';
import getController from './Controller/getController.js';
import UI from './UI/UI.jsx';

const UltimateFields = window.UltimateFields = {
	initializeContainerById( id ) {
		const element = document.getElementById( id );
		const json = JSON.parse( element.querySelector( 'script' ).innerHTML );
		const { type, settings, data } = json;
		const controller = getController( type );

		controller.init({ element, settings, data });
	},

	startFieldsBox() {
		UltimateFields.ui = new UI( document.querySelector('.uf-fields-box-wrapper') );
	}
}

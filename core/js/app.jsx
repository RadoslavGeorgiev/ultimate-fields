import React from 'react';
import ReactDOM from 'react-dom';
import getController from './Controller/getController.js';

const UltimateFields = window.UltimateFields = {
	initializeContainerById( id ) {
		const element = document.getElementById( id );
		const json = JSON.parse( element.querySelector( 'script' ).innerHTML );
		const { type, settings, data } = json;
		const controller = getController( type );

		controller.init({ element, settings, data });
	}
}

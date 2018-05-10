import React from 'react';
import Overlay from './../Overlay.jsx';
import Button from './../Button.jsx';
import Container from './../Container.jsx';
import StoreManager from './StoreManager.js';
import { Provider } from 'react-redux';

export function editField( manager ) {
	const fields = UltimateFields.ui.getFields();

	Overlay.show(
		<React.Fragment>
			<Overlay.Title>Edit Field</Overlay.Title>

			<Overlay.Footer>
				<Button>Save</Button>
				<Button onClick={ Overlay.remove }>Close</Button>
			</Overlay.Footer>

			<Provider store={ manager.getStore() }>
				<Container children={ fields } source="__" layout="rows" description_position="label" className="uf-fields--boxed" display_tabs_wrapper={ true } />
			</Provider>
		</React.Fragment>
	);
}

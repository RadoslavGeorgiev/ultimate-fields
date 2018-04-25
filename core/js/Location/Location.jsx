import React from 'react';

export default class Location extends React.Component {
	getHiddenField( name ) {
		const state = JSON.stringify( this.state.data );
		return <input type="hidden" name={ name } className="uf-container-data" value={ state } />
	}
}

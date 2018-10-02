import React, { Component } from 'react';

export default ( { children: title, icon, onClick } ) => {
	return (
		<a
			href="#"
			title={ title }
			className={ 'uf-group__control' + ( 'trash' === icon ? ' uf-group__control--remove' : '' ) }
			onClick={ e => { e.preventDefault(); onClick() } }
		>
			<span className={ `dashicons dashicons-${ icon }` }></span>
		</a>
	);
}
